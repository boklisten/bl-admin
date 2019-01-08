import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CartItem } from "../../../cartItem";
import { OrderItemHelperService } from "../../../order-item-helper/order-item-helper.service";

@Component({
	selector: "app-cart-list-item-age",
	templateUrl: "./cart-list-item-age.component.html",
	styleUrls: ["./cart-list-item-age.component.scss"]
})
export class CartListItemAgeComponent implements OnInit {
	@Input() cartItem: CartItem;
	@Output() itemAgeChange: EventEmitter<"new" | "used">;

	constructor(private _orderItemHelperService: OrderItemHelperService) {
		this.itemAgeChange = new EventEmitter();
	}

	ngOnInit() {}

	public onAgeChange() {
		this.itemAgeChange.emit(this.cartItem.orderItem.age);

		this._orderItemHelperService
			.updateOrderItem(
				this.cartItem.action,
				this.cartItem.orderItem,
				this.cartItem.item,
				this.cartItem.period,
				this.cartItem.customerItem
			)
			.then(() => {})
			.catch(e => {
				console.log("cartListItemAge: could not update orderItem", e);
			});
	}
}
