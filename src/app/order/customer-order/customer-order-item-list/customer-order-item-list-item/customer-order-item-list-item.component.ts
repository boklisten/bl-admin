import { Component, Input, OnInit } from "@angular/core";
import { Delivery, Order, OrderItem } from "@boklisten/bl-model";
import { DeliveryService } from "@boklisten/bl-connect";
import { BranchStoreService } from "../../../../branch/branch-store.service";

@Component({
	selector: "app-customer-order-item-list-item",
	templateUrl: "./customer-order-item-list-item.component.html",
	styleUrls: ["./customer-order-item-list-item.component.scss"]
})
export class CustomerOrderItemListItemComponent implements OnInit {
	@Input() customerOrderItem: {
		orderItem: OrderItem;
		order: Order;
	};
	public delivery: Delivery;
	public haveDelivery: boolean;
	public currentBranchId: string;
	public wait: boolean;

	constructor(
		private _deliveryService: DeliveryService,
		private _branchStoreService: BranchStoreService
	) {}

	ngOnInit() {
		if (this.customerOrderItem.order.delivery) {
			this.wait = true;
			this._deliveryService
				.getById(this.customerOrderItem.order.delivery as string)
				.then(delivery => {
					this.delivery = delivery;
					this.haveDelivery =
						this.delivery.method === "bring" && this.havePayed();
					this.wait = false;
				})
				.catch(() => {
					console.log(
						"CustomerOrderItemListItemComponent: could not get delivery"
					);
					this.wait = false;
				});
		}

		this.currentBranchId = this._branchStoreService.getCurrentBranch().id;

		this._branchStoreService.onBranchChange().subscribe(() => {
			this.currentBranchId = this._branchStoreService.getCurrentBranch().id;
		});
	}

	public havePayed() {
		return (
			this.customerOrderItem.order.payments &&
			this.customerOrderItem.order.payments.length > 0
		);
	}
}
