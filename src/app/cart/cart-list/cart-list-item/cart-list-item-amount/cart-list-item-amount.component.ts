import {
	Component,
	OnInit,
	Input,
	DoCheck,
	SimpleChanges
} from "@angular/core";
import { CartItem } from "../../../cartItem";
import {
	Delivery,
	Order,
	OrderItem,
	OrderItemType,
	Period
} from "@wizardcoder/bl-model";
import { OrderItemPriceService } from "../../../../price/order-item-price/order-item-price.service";

@Component({
	selector: "app-cart-list-item-amount",
	templateUrl: "./cart-list-item-amount.component.html",
	styleUrls: ["./cart-list-item-amount.component.scss"]
})
export class CartListItemAmountComponent implements OnInit, DoCheck {
	@Input() orderItem: OrderItem;
	@Input() originalOrderItem: OrderItem;
	@Input() originalOrder: Order;
	@Input() delivery: Delivery;

	public alreadyPayedAmount: number;
	public setShowAlreadyPayedAmount: boolean;
	public showDelivery: boolean;
	public showAmountLeftToPay: boolean;
	public showAlreadyPayedCheck: boolean;

	private oldOrderItemType: OrderItemType;
	private oldOrderItemPeriod: Period;

	constructor(private _orderItemPriceService: OrderItemPriceService) {}

	ngOnInit() {
		this.setValues();
	}

	ngDoCheck() {
		let newOrderItemPeriod =
			this.orderItem.info && this.orderItem.info.periodType
				? this.orderItem.info.periodType
				: null;
		if (
			this.orderItem.type !== this.oldOrderItemType ||
			newOrderItemPeriod !== this.oldOrderItemPeriod
		) {
			this.setValues();
		}
	}

	private setValues() {
		this.setShowAlreadyPayedCheck();
		this.setAlreadyPayedAmount();
		this.setShowDelivery();
		this.oldOrderItemType = this.orderItem.type;
		this.oldOrderItemPeriod =
			this.orderItem.info && this.orderItem.info.periodType
				? this.orderItem.info.periodType
				: null;
	}

	private setAlreadyPayedAmount() {
		if (
			this.orderItem.type !== "cancel" &&
			this.originalOrder &&
			this.originalOrderItem &&
			this.originalOrder.payments &&
			this.originalOrder.payments.length > 0
		) {
			this.alreadyPayedAmount = this.originalOrderItem.amount;
			return;
		}

		this.alreadyPayedAmount = 0;
	}

	private setShowAlreadyPayedCheck() {
		if (!this.originalOrder || !this.originalOrderItem) {
			this.showAlreadyPayedCheck = false;
			return;
		}

		this.showAlreadyPayedCheck =
			this._orderItemPriceService.orderItemTypePayedFor(
				this.orderItem,
				this.originalOrderItem,
				this.originalOrder
			) || this.orderItem.amount === 0;
	}

	private setShowDelivery() {
		this.showDelivery = this.delivery && this.delivery.method === "bring";
	}

	private setShowAmountLeftToPay() {
		if (this.orderItem.info && this.orderItem.info["amountLeftToPay"]) {
			this.showAmountLeftToPay = true;
		} else {
			this.showAmountLeftToPay = false;
		}
	}
}
