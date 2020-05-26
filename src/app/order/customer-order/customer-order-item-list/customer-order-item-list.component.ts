import { Component, OnInit } from "@angular/core";
import { CustomerDetailService } from "../../../customer/customer-detail/customer-detail.service";
import { DeliveryService, OrderService } from "@wizardcoder/bl-connect";
import {
	Delivery,
	Item,
	Order,
	OrderItem,
	UserDetail
} from "@wizardcoder/bl-model";
import { CustomerService } from "../../../customer/customer.service";
import { BranchStoreService } from "../../../branch/branch-store.service";
import { CustomerOrderItemListService } from "./customer-order-item-list.service";

@Component({
	selector: "app-customer-order-item-list",
	templateUrl: "./customer-order-item-list.component.html",
	styleUrls: ["./customer-order-item-list.component.scss"]
})
export class CustomerOrderItemListComponent implements OnInit {
	public customerDetail: UserDetail;
	public customerOrderItems: {
		orderItem: OrderItem;
		order: Order;
		item: Item;
	}[];
	public noOrderItemsText: string;
	public currentBranchId: string;
	public wait: boolean;
	public delivery: Delivery;

	constructor(
		private _customerService: CustomerService,
		private _deliveryService: DeliveryService,
		private _branchStoreService: BranchStoreService,
		private _customerOrderItemListService: CustomerOrderItemListService
	) {
		this.customerOrderItems = [];
		this.noOrderItemsText = "Customer has no ordered items";
	}

	ngOnInit() {
		this.wait = true;
		this._customerOrderItemListService.fetchOrderedItems();
		//.then(orderedItems => {
		//this.customerOrderItems = orderedItems;
		//});

		this.customerOrderItems = this._customerOrderItemListService.getCustomerOrderItems();

		this.currentBranchId = this._branchStoreService.getCurrentBranch().id;

		this._customerService.onCustomerChange().subscribe(() => {
			//this.customerOrderItems = [];
		});

		this._customerOrderItemListService
			.onWait()
			.subscribe((wait: boolean) => {
				this.wait = wait;
			});

		this._branchStoreService.onBranchChange().subscribe(() => {
			this.currentBranchId = this._branchStoreService.getCurrentBranch().id;
		});

		this._customerOrderItemListService
			.onCustomerOrderItemListChange()
			.subscribe(() => {
				this.customerOrderItems = this._customerOrderItemListService.getCustomerOrderItems();
			});

		//this.customerOrderItems = this._customerOrderItemListService.fetchOrderedItems(
	}

	public async haveDelivery(customerOrderItem: {
		orderItem: OrderItem;
		order: Order;
	}): Promise<boolean> {
		if (!this.havePayed(customerOrderItem)) {
			return false;
		}

		try {
			const delivery = await this._deliveryService.getById(
				customerOrderItem.order.delivery as string
			);
			return delivery.method === "bring";
		} catch (e) {
			return false;
		}
	}

	public havePayed(customerOrderItem: {
		orderItem: OrderItem;
		order: Order;
	}) {
		if (
			customerOrderItem.order.payments &&
			customerOrderItem.order.payments.length > 0
		) {
			return true;
		}
		return false;
	}
}
