import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CartItem } from "../../../cart-item/cart-item";
import { CartItemAction } from "../../../cart-item/cart-item-action";
import { OrderItemPriceService } from "../../../../price/order-item-price/order-item-price.service";
import { OrderItemType } from "@wizardcoder/bl-model/dist/order/order-item/order-item-type";
import { DateService } from "../../../../date/date.service";
import { CustomerService } from "../../../../customer/customer.service";
import { CartHelperService } from "../../../cart-helper.service";
import { CustomerItemPriceService } from "../../../../price/customer-item-price/customer-item-price.service";
import { OrderItemHelperService } from "../../../order-item-helper/order-item-helper.service";
import { AuthService } from "../../../../auth/auth.service";
import { Period } from "@wizardcoder/bl-model";

@Component({
	selector: "app-cart-list-item-action",
	templateUrl: "./cart-list-item-action.component.html",
	styleUrls: ["./cart-list-item-action.component.scss"]
})
export class CartListItemActionComponent implements OnInit {
	@Input() cartItem: CartItem;
	@Output() actionChange: EventEmitter<CartItemAction>;
	public updating: boolean;

	public actionList: CartItemAction[];
	public selectedAction: CartItemAction;
	//public action: CartItemAction;

	constructor(
		private _orderItemPriceService: OrderItemPriceService,
		private _dateService: DateService,
		private _customerService: CustomerService,
		private _cartHelperService: CartHelperService,
		private _authService: AuthService,
		private _orderItemHelperService: OrderItemHelperService,
		private _customerItemPriceService: CustomerItemPriceService
	) {
		this.actionList = [];
		this.actionChange = new EventEmitter<CartItemAction>();
	}

	ngOnInit() {
		//this.createActionList();
		//this.updating = false;
		this.actionList = this.cartItem.getValidActions();
		//this.action = this.actionList[0];
		this.selectedAction = this.actionList[0];
	}

	createActionList() {
		/*
		if (this.cartItem.originalOrder) {
			this.actionList = [
				{ action: "rent", period: "semester" },
				{ action: "rent", period: "year" },
				{ action: "partly-payment", period: "semester" },
				{ action: "partly-payment", period: "year" },
				{ action: "buy" },
				{ action: "cancel" }
			];
		} else if (this.cartItem.customerItem) {
			if (
				this.cartItem.customerItem.type &&
				this.cartItem.customerItem.type === "partly-payment"
			) {
				this.actionList = [
					{ action: "buyback" },
					{ action: "buyout" },
					{ action: "extend", period: "semester" },
					{ action: "cancel" }
				];
			} else {
				// the customerItem has type "rent" or no type
				this.actionList = [
					{ action: "return" },
					{ action: "buyout" },
					{ action: "extend", period: "semester" },
					{ action: "cancel" }
				];
			}
		} else if (this._customerService.haveCustomer()) {
			this.actionList = [
				{ action: "rent", period: "semester" },
				{ action: "rent", period: "year" },
				{ action: "partly-payment", period: "semester" },
				{ action: "partly-payment", period: "year" },
				{ action: "buy" },
				{ action: "sell" }
			];
		} else {
			this.actionList = [{ action: "buy" }];
		}

		this.actionList = this.actionList.filter(action => {
			//return this.showAction(action.action, action.period);
		});

		this.selectDefaultAction();
    */
	}

	public showAction(action: CartItemAction): boolean {
		/*
		return this._cartHelperService.isActionValidOnCartItem(
			action,
			this.cartItem,
			period
		);
    */
		return true;
	}

	public calculateActionValue(action: CartItemAction) {
		let selectedActionString = action.action;
		selectedActionString += !action.period ? "" : action.period;
		return selectedActionString;
	}

	public onActionChange(action: CartItemAction) {
		//this.action = this.calculateActionValue(action);
		this.selectedAction = action;
		console.log("selectedAction", this.selectedAction);
		//this.updateOrderItemBasedOnAction(this.cartItem.action, period);
		//this.actionChange.emit(this.cartItem.action);
	}

	public originalAction(action: CartItemAction, period?: Period): boolean {
		return false;
		//if (!this.cartItem.originalOrderItem) {
		//return false;
		//} else {
		//if (this.cartItem.originalOrderItem.type === "rent") {
		//return (
		//period === this.cartItem.originalOrderItem.info.periodType
		//);
		//} else {
		//return action === this.cartItem.originalOrderItem.type;
		//}
		//}
	}

	private selectDefaultAction() {
		//this.onActionChange(
		//this.cartItem.orderItem.type,
		//this.cartItem.orderItem.info
		//? this.cartItem.orderItem.info.periodType
		//: null
		//);
	}

	private updateOrderItemBasedOnAction(
		action: CartItemAction,
		period?: Period
	) {
		/*
		this.updating = true;
		this._orderItemHelperService
			.updateOrderItem(
				action,
				this.cartItem.orderItem,
				this.cartItem.item,
				period,
				this.cartItem.customerItem
			)
			.then(() => {
				this.updating = false;
			})
			.catch(e => {
				console.log(
					"cartListItemAction: could not update orderItem",
					e
				);
			});
      */
	}
}
