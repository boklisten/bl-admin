import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Delivery, OrderItem } from "@wizardcoder/bl-model";
import { OrderItemType } from "@wizardcoder/bl-model/dist/order/order-item/order-item-type";
import { CartService } from "../../cart.service";
import { CartItem } from "../../cartItem";
import { CartItemAction } from "../../cartItemAction";
import { ItemPriceService } from "../../../price/item-price/item-price.service";
import { CustomerOrderService } from "../../../order/customer-order/customer-order.service";
import { OrderItemPriceService } from "../../../price/order-item-price/order-item-price.service";
import { DateService } from "../../../date/date.service";
import { Period } from "@wizardcoder/bl-model/dist/period/period";
import { DeliveryService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-cart-list-item",
	templateUrl: "./cart-list-item.component.html",
	styleUrls: ["./cart-list-item.component.scss"]
})
export class CartListItemComponent implements OnInit {
	@Input() cartItem: CartItem;
	@Output() cartItemChange: EventEmitter<boolean>;
	public cartItemAction: CartItemAction;
	public delivery: Delivery;

	constructor(
		private _cartService: CartService,
		private _itemPriceService: ItemPriceService,
		private _customerOrderService: CustomerOrderService,
		private _orderItemPriceService: OrderItemPriceService,
		private _deliveryService: DeliveryService,
		private _dateService: DateService
	) {
		this.cartItemChange = new EventEmitter<boolean>();
	}

	ngOnInit() {
		if (
			this.cartItem.originalOrder &&
			this.cartItem.originalOrder.delivery
		) {
			this._deliveryService
				.getById(this.cartItem.originalOrder.delivery as string)
				.then((delivery: Delivery) => {
					this.delivery = delivery;
				})
				.catch(() => {
					console.log("could not get delivery");
				});
		}
	}

	public onActionChange(action: CartItemAction) {
		this.cartItemChange.emit(true);
	}

	public onItemAgeChange() {
		this.onActionChange(this.cartItem.action);
		this.cartItemChange.emit(true);
	}

	public remove() {
		this._cartService.remove(this.cartItem.item.id);
	}
}
