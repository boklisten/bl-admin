import {
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
} from "@angular/core";
import {
	OrderFilter,
	OrderManagerListService,
} from "./order-manager-list.service";
import { Delivery, Order } from "@boklisten/bl-model";
import { BranchStoreService } from "../../branch/branch-store.service";
import { CustomerService } from "../../customer/customer.service";
import { timer } from "rxjs/internal/observable/timer";
import { Observable } from "rxjs/internal/Observable";
import { Subscription } from "rxjs";
import { CheckoutService } from "../../checkout/checkout.service";
import { DatabaseExcelService } from "../../database/database-excel/database-excel.service";
import {
	BranchService,
	DeliveryService,
	ItemService,
	UserDetailService,
} from "@boklisten/bl-connect";

@Component({
	selector: "app-order-manager-list",
	templateUrl: "./order-manager-list.component.html",
	styleUrls: ["./order-manager-list.component.scss"],
})
export class OrderManagerListComponent implements OnInit, OnDestroy {
	placedOrders: Order[];
	tempPlacedOrders: Order[];
	activeOrder: Order;
	allBranchesFilter: boolean;
	orderFilter: OrderFilter;
	interval: number;
	autoFetchTimer: Observable<number>;
	fetching: boolean;
	@Output() selectedOrder: EventEmitter<Order>;
	private checkoutChange$: Subscription;
	private orderManagerListChange$: Subscription;

	constructor(
		private _databaseExcelService: DatabaseExcelService,
		private _orderManagerListService: OrderManagerListService,
		private _branchStoreService: BranchStoreService,
		private _customerService: CustomerService,
		private _checkoutService: CheckoutService,
		private _itemService: ItemService,
		private _deliveryService: DeliveryService,
		private _userDetailService: UserDetailService,
		private branchService: BranchService
	) {
		this.selectedOrder = new EventEmitter<Order>();
		this.allBranchesFilter = false;
		this.interval = 10000;
		this.fetching = false;
	}

	ngOnInit() {
		this.orderFilter = this._orderManagerListService.getOrderFilter();
		this.getOrders();
		this.onBranchChange();

		this.autoFetchTimer = timer(this.interval, this.interval);

		this.autoFetchTimer.subscribe(() => {
			if (this.orderFilter.autoFetch) {
				this.getOrders();
				this.fetching = true;
			}
		});

		this.handleCheckoutChange();
		this.handleOrderManagerListChange();
	}

	ngOnDestroy() {
		this.orderManagerListChange$.unsubscribe();
		this.checkoutChange$.unsubscribe();
	}

	private handleOrderManagerListChange() {
		this.orderManagerListChange$ = this._orderManagerListService.onReload(
			() => {
				this.getOrders();
			}
		);
	}

	private handleCheckoutChange() {
		this.checkoutChange$ = this._checkoutService.subscribe(() => {
			this.getOrders();
		});
	}

	onAutoFetch(): Observable<number> {
		return this.autoFetchTimer;
	}

	onAllBranchesFilterClick() {
		this.allBranchesFilter = !this.allBranchesFilter;

		if (!this.allBranchesFilter) {
			this.filterOnlyCurrentBranch();
		} else {
			this.placedOrders = this.tempPlacedOrders;
		}
	}

	onFilterUpdate() {
		this._orderManagerListService.setFilter(this.orderFilter);
		this.getOrders();
	}

	private getOrders() {
		this.fetching = true;
		this.placedOrders = [];
		this._orderManagerListService
			.getPlacedOrders()
			.then((orders: Order[]) => {
				this.placedOrders = orders;
				this.tempPlacedOrders = orders;
				this.filterOnlyCurrentBranch();
				this.filterNewestFirst();

				setTimeout(() => {
					this.fetching = false;
				}, 1000);
			})
			.catch((err) => {
				this.placedOrders = [];
				this.fetching = false;
			});
	}

	public async printBringDeliveriesToExcel() {
		this.fetching = true;
		const pickupPointParcels = [];
		const mailParcels = [];
		for (const placedOrder of this.placedOrders) {
			try {
				const delivery: Delivery = await this._deliveryService.getById(
					placedOrder.delivery as string
				);
				if (delivery.method === "bring") {
					const customerDetail = await this._userDetailService.getById(
						placedOrder.customer as string
					);
					const shipmentAddress = delivery.info["shipmentAddress"];
					if (delivery.info["product"] === "3584") {
						mailParcels.push({
							"Name *": shipmentAddress.name,
							"Address line 1 *": shipmentAddress.address,
							"Address line 2 *": "",
							"Postal code *": shipmentAddress.postalCode,
							"Contact person": shipmentAddress.name,
							"Mobile number *": "+47" + customerDetail.phone,
							"E-mail *": customerDetail.email,
							"Sender's reference": "",
							"Recipient's reference": "",
							"Bag on Door (yes/no)": "no",
						});
					} else {
						pickupPointParcels.push({
							"Number of items (per shipment) *": 1,
							"Name *": shipmentAddress.name,
							"Address line 1 *": shipmentAddress.address,
							"Address line 2 *": "",
							"Postal code *": shipmentAddress.postalCode,
							"Contact person": shipmentAddress.name,
							"Mobile number (incl. country code) *":
								"+47" + customerDetail.phone,
							"E-mail *": customerDetail.email,
							"Sender's reference": "",
							"Recipient's reference": "",
						});
					}
				}
			} catch (err) {
				console.log(
					"OrderMangerPrintBring: could not fetch details",
					err
				);
			}
		}

		this._databaseExcelService.objectsToExcelFile(
			pickupPointParcels,
			"hentested"
		);
		this._databaseExcelService.objectsToExcelFile(mailParcels, "post");
		this.fetching = false;
	}

	public async printOrderOverviewToExcel() {
		this.fetching = true;
		const orderOverview = [];
		const filteredOrders = this.placedOrders.map((order) => {
			order.orderItems = order.orderItems.filter(
				(orderItem) => orderItem.movedToOrder === undefined
			);
			return order;
		});
		filteredOrders.forEach((placedOrder) => {
			placedOrder.orderItems.forEach((orderItem) => {
				orderOverview.push({
					customer: placedOrder.customer,
					title: orderItem.title,
					isbn: orderItem.item,
					school: placedOrder.branch,
				});
			});
		});

		const populatedRows = await Promise.all(
			orderOverview.map(async (itemOverview) => {
				const item = await this._itemService.getById(
					itemOverview.isbn as string
				);
				const branch = await this.branchService.getById(
					itemOverview.school
				);
				const customer = await this._userDetailService.getById(
					itemOverview.customer as string
				);

				return {
					name: customer.name,
					email: customer.email,
					phone: customer.phone,
					address: customer.address,
					school: branch.name,
					title: itemOverview.title,
					isbn: item.info.isbn,
					pivot: 1,
				};
			})
		);

		populatedRows.sort((a, b) => a.name.localeCompare(b.name));
		this._databaseExcelService.objectsToExcelFile(populatedRows, "orders");
		this.fetching = false;
	}

	onBranchChange() {
		this._branchStoreService.onBranchChange().subscribe(() => {
			if (this.orderFilter.onlyCurrentBranch) {
				this.getOrders();
				this.activeOrder = null;
				this.selectedOrder.emit(null);
			}
		});
	}

	filterNewestFirst() {
		this.placedOrders = this.tempPlacedOrders.sort((orderA, orderB) => {
			return (
				new Date(orderB.creationTime).getTime() -
				new Date(orderA.creationTime).getTime()
			);
		});
	}

	filterOnlyCurrentBranch() {
		const branch = this._branchStoreService.getCurrentBranch();

		this.placedOrders = this.tempPlacedOrders.filter((order: Order) => {
			return order.branch === branch.id;
		});
	}

	onOrderClick(order: Order) {
		this.activeOrder = order;
		this.selectedOrder.emit(order);
	}
}
