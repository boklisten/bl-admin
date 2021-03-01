import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Order } from "@boklisten/bl-model";
import { OrderService } from "@boklisten/bl-connect";

@Component({
	selector: "app-order-confirm",
	templateUrl: "./order-confirm.component.html",
	styleUrls: ["./order-confirm.component.scss"],
})
export class OrderConfirmComponent implements OnInit {
	@Input() order: Order;
	@Output() orderChange: EventEmitter<Order>;

	constructor(private _orderService: OrderService) {
		this.orderChange = new EventEmitter();
	}

	ngOnInit() {}

	public onConfirm() {
		this._orderService
			.updateWithOperation(this.order.id, {}, "confirm")
			.then((confirmedOrder) => {
				this.orderChange.emit(confirmedOrder);
			})
			.catch((e) => {
				console.log("could not confirm", e);
			});
	}
}
