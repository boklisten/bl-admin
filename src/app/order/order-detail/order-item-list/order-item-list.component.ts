import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Order } from "@wizardcoder/bl-model";
import { OrderService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-order-item-list",
	templateUrl: "./order-item-list.component.html",
	styleUrls: ["./order-item-list.component.scss"]
})
export class OrderItemListComponent implements OnInit {
	@Input() order: Order;
	@Output() reload: EventEmitter<boolean>;
	public warningText: string;
	public wait;

	constructor(private _orderService: OrderService) {
		this.reload = new EventEmitter();
	}

	ngOnInit() {
		/*
		if (!this.order.orderItems || this.order.orderItems.length <= 0) {
			this.warningText = "There was no items attached to the order";
		}
    */
	}

	public calculateTotalAmount(): number {
		let totalAmount = 0;

		for (const orderItem of this.order.orderItems) {
			totalAmount += orderItem.amount;
		}

		return totalAmount;
	}

	public onDeleteOrderItem(index: number) {
		if (this.order.orderItems.length == 1) {
			return;
		}

		this.order.orderItems.splice(index, 1);
		this._orderService
			.update(this.order.id, { orderItems: this.order.orderItems })
			.then(() => {
				this.reload.emit(true);
			})
			.catch(() => {
				this.reload.emit(true);
			});
	}
}
