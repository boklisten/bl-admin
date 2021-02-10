import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	OnDestroy
} from "@angular/core";
import {
	OrderFilter,
	OrderManagerListService
} from "./order-manager-list.service";
import { Order } from "@boklisten/bl-model";
import { BranchStoreService } from "../../branch/branch-store.service";
import { CustomerService } from "../../customer/customer.service";
import { timer } from "rxjs/internal/observable/timer";
import { Observable } from "rxjs/internal/Observable";
import { Subscription } from "rxjs";
import { CheckoutService } from "../../checkout/checkout.service";

@Component({
	selector: "app-order-manager-list",
	templateUrl: "./order-manager-list.component.html",
	styleUrls: ["./order-manager-list.component.scss"]
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
		private _orderManagerListService: OrderManagerListService,
		private _branchStoreService: BranchStoreService,
		private _customerService: CustomerService,
		private _checkoutService: CheckoutService
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
			.catch(err => {
				this.placedOrders = [];
				this.fetching = false;
			});
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
