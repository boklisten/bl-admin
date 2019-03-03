import { Injectable } from "@angular/core";
import { CartItemAction } from "./cartItemAction";
import { BranchStoreService } from "../branch/branch-store.service";
import { CartItem } from "./cartItem";
import { Branch, CustomerItem, Item, OrderItem } from "@wizardcoder/bl-model";
import { CustomerService } from "../customer/customer.service";
import { ItemPriceService } from "../price/item-price/item-price.service";
import { OrderItemType } from "@wizardcoder/bl-model/dist/order/order-item/order-item-type";

import { OrderItemInfo } from "@wizardcoder/bl-model/dist/order/order-item/order-item-info";
import { DateService } from "../date/date.service";
import { OrderItemPriceService } from "../price/order-item-price/order-item-price.service";
import { Period } from "@wizardcoder/bl-model/dist/period/period";
import { CustomerItemPriceService } from "../price/customer-item-price/customer-item-price.service";
import { BranchItemHelperService } from "../branch/branch-item-helper/branch-item-helper.service";
import { AuthService } from "../auth/auth.service";
import { BranchHelperService } from "../branch/branch-helper/branch-helper.service";
import { OrderItemAmounts } from "../price/customer-item-price/customer-item-price.service";

@Injectable()
export class CartHelperService {
	constructor(
		private _branchStoreService: BranchStoreService,
		private _branchHelperService: BranchHelperService,
		private _customerService: CustomerService,
		private _itemPriceService: ItemPriceService,
		private _dateService: DateService,
		private _orderItemPriceService: OrderItemPriceService,
		private _customerItemPriceService: CustomerItemPriceService,
		private _authService: AuthService,
		private _branchItemHelperService: BranchItemHelperService
	) {}

	public cartItemActionValidOnBranch(action: CartItemAction): boolean {
		const branch = this._branchStoreService.getCurrentBranch();
		return this._branchHelperService.actionValidOnBranch(branch, action);
	}

	public isActionValidOnItem(action, item: Item, period?: Period): boolean {
		if (action === "buy") {
			return this._branchItemHelperService.isBuyValid(item);
		}

		if (this._customerService.haveCustomer()) {
			switch (action) {
				case "rent":
					return this._branchItemHelperService.isRentValid(
						item,
						period
					);
				case "partly-payment":
					return this._branchItemHelperService.isPartlyPaymentValid(
						item,
						period
					);
				case "sell":
					return this._branchItemHelperService.isSellValid(item);
				case "cancel":
					return true;
			}
		}

		return false;
	}

	public isActionValidOnCartItem(
		action: CartItemAction,
		cartItem: CartItem,
		period?: Period
	): boolean {
		if (!cartItem.customerItem) {
			// if no customerItem is present, check like regular item
			return this.isActionValidOnItem(action, cartItem.item, period);
		}

		if (
			!cartItem.customerItem.type ||
			cartItem.customerItem.type === "rent"
		) {
			return this.isActionValidOnCustomerItemTypeRent(
				action,
				cartItem.customerItem
			);
		}

		if (cartItem.customerItem.type === "partly-payment") {
			return this.isActionValidOnCustomerItemTypePartlyPayment(
				action,
				cartItem.customerItem
			);
		}

		return false;
	}

	private isActionValidOnCustomerItemTypeRent(
		action: CartItemAction,
		customerItem: CustomerItem
	): boolean {
		switch (action) {
			case "cancel":
				return (
					customerItem.handout &&
					this._dateService.isCustomerItemCancelValid(
						customerItem.handoutInfo.time
					)
				);
			case "return":
				return (
					customerItem.handout &&
					this._dateService.isCustomerItemReturnValid(
						customerItem.deadline
					) &&
					!this._dateService.isCustomerItemCancelValid(
						customerItem.handoutInfo.time
					)
				);
			case "buyout":
				return (
					customerItem.handout &&
					this._dateService.isCustomerItemReturnValid(
						customerItem.deadline
					)
				);
			case "extend":
				return (
					customerItem.handout &&
					this._dateService.isCustomerItemReturnValid(
						customerItem.deadline
					) &&
					this._dateService.isCustomerItemExtendValid(
						customerItem.deadline,
						"semester"
					)
				);
			default:
				return false;
		}
	}

	private isActionValidOnCustomerItemTypePartlyPayment(
		action: CartItemAction,
		customerItem: CustomerItem
	): boolean {
		switch (action) {
			case "buyout":
				return (
					(customerItem.handout &&
						!this._dateService.isCustomerItemCancelValid(
							customerItem.handoutInfo.time
						) &&
						this._dateService.isCustomerItemReturnValid(
							customerItem.deadline
						)) ||
					this._authService.isAdmin()
				);
			case "cancel":
				return (
					(customerItem.handout &&
						this._dateService.isCustomerItemCancelValid(
							customerItem.handoutInfo.time
						)) ||
					this._authService.isAdmin()
				);
			default:
				return false;
		}
	}

	public async createOrderItemBasedOnCustomerItem(
		customerItem: CustomerItem,
		item: Item
	) {
		if (!customerItem.type || customerItem.type === "rent") {
			return this.createOrderItemBasedOnCustomerItemTypeRent(
				customerItem,
				item
			);
		}

		if (customerItem.type === "partly-payment") {
			return this.createOrderItemBasedOnCustomerItemTypePartlyPayment(
				customerItem,
				item
			);
		}

		throw new Error(
			`customerItem.type '${customerItem.type}' is not supported`
		);
	}

	private async createOrderItemBasedOnCustomerItemTypePartlyPayment(
		customerItem: CustomerItem,
		item: Item
	) {
		if (
			this._dateService.isCustomerItemCancelValid(
				customerItem.handoutInfo.time
			) &&
			this._authService.isManager()
		) {
			// cancel
			return await this.createOrderItemTypeCancel(customerItem, item);
		} else if (this._branchItemHelperService.isBuyValid(item)) {
			// buyout
			return this.createOrderItemTypeBuyout(customerItem, item);
		} else {
			throw new Error("no actions valid on customerItem");
		}
	}

	private async createOrderItemBasedOnCustomerItemTypeRent(
		customerItem: CustomerItem,
		item: Item
	) {
		if (
			!this._dateService.isCustomerItemReturnValid(
				customerItem.deadline
			) &&
			!this._authService.isAdmin()
		) {
			throw new Error(
				"can not add customer item to cart, the deadline is overdue"
			);
		}

		if (
			this._dateService.isCustomerItemCancelValid(
				customerItem.handoutInfo.time
			) &&
			this._authService.isManager()
		) {
			return await this.createOrderItemTypeCancel(customerItem, item);
		} else if (
			this._dateService.isCustomerItemReturnValid(
				customerItem.deadline
			) &&
			!this._dateService.isCustomerItemCancelValid(
				customerItem.handoutInfo.time
			)
		) {
			return this.createOrderItemTypeReturn(customerItem, item);
		} else if (
			this._dateService.isCustomerItemExtendValid(
				customerItem.deadline,
				"semester"
			)
		) {
			return this.createOrderItemTypeExtend(
				customerItem,
				item,
				"semester"
			);
		} else if (this._branchItemHelperService.isBuyValid(item)) {
			return this.createOrderItemTypeBuyout(customerItem, item);
		} else {
			throw new Error(
				"cartHelperService: this customerItem can not be handled"
			);
		}
	}

	public createOrderItemTypeExtend(
		customerItem: CustomerItem,
		item: Item,
		period: Period
	): OrderItem {
		const orderItem: OrderItem = {
			type: "extend",
			item: item.id,
			title: item.title,
			amount: 0,
			unitPrice: 0,
			taxRate: 0,
			taxAmount: 0,
			customerItem: customerItem.id
		};

		const orderItemAmounts = this._customerItemPriceService.calculateAmountsExtend(
			customerItem,
			period,
			item
		);
		orderItem.amount = orderItemAmounts.amount;
		orderItem.unitPrice = orderItemAmounts.unitPrice;
		orderItem.taxAmount = orderItemAmounts.taxAmount;
		orderItem.taxRate = item.taxRate;

		return orderItem;
	}

	public async createOrderItemTypeCancel(
		customerItem: CustomerItem,
		item: Item
	): Promise<OrderItem> {
		return {
			type: "cancel",
			item: item.id,
			title: item.title,
			amount: await this._customerItemPriceService.priceCancel(
				customerItem
			),
			unitPrice: 0,
			taxRate: 0,
			taxAmount: 0,
			customerItem: customerItem.id
		};
	}

	public createOrderItemTypeReturn(
		customerItem: CustomerItem,
		item: Item
	): OrderItem {
		return {
			type: "return",
			item: item.id,
			title: item.title,
			amount: this._customerItemPriceService.priceReturn(customerItem),
			unitPrice: 0,
			taxRate: 0,
			taxAmount: 0,
			customerItem: customerItem.id
		};
	}

	public createOrderItemTypeBuyout(
		customerItem: CustomerItem,
		item: Item
	): OrderItem {
		let orderItemAmounts: OrderItemAmounts;

		if (!customerItem.type || customerItem.type === "rent") {
			orderItemAmounts = this._customerItemPriceService.calculateAmountsBuyout(
				item
			);
		} else if (customerItem.type === "partly-payment") {
			orderItemAmounts = this._customerItemPriceService.calculateAmountPartlyPaymentBuyout(
				customerItem,
				item
			);
		} else {
			throw new Error(
				`customerItem.type '${customerItem.type}' is not supported`
			);
		}

		return {
			type: "buyout",
			item: item.id,
			title: item.title,
			amount: orderItemAmounts.amount,
			unitPrice: orderItemAmounts.unitPrice,
			taxAmount: orderItemAmounts.taxAmount,
			taxRate: item.taxRate,
			customerItem: customerItem.id
		};
	}

	public createOrderItemBasedOnItem(item: Item): OrderItem {
		let action: { action: CartItemAction; period?: Period };

		try {
			action = this.getFirstValidActionOnItem(item);
		} catch (e) {
			throw new Error("no action can be done on this item");
		}

		const orderItem = {
			type: action.action,
			taxRate: item.taxRate
		} as OrderItem;

		if (
			action.action === "rent" ||
			action.action === "partly-payment" ||
			action.action === "buy"
		) {
			orderItem.handout = true;
    }

		orderItem.info = this.createDefaultOrderItemInfo(
			this.orderItemTypeBasedOnAction(action.action),
			action.period
		);

		const calculatedOrderItemAmounts = this._orderItemPriceService.calculateAmounts(
			orderItem,
			item
		);

		orderItem.item = item.id;
		orderItem.title = item.title;
		orderItem.unitPrice = calculatedOrderItemAmounts.unitPrice;
		orderItem.taxRate = calculatedOrderItemAmounts.taxAmount;
		orderItem.amount = calculatedOrderItemAmounts.amount;

		return orderItem;
	}

	public getFirstValidActionOnItem(
		item: Item
	): { action: CartItemAction; period?: Period } {
		const actionList: { action: CartItemAction; period?: Period }[] = [
			{ action: "rent", period: "semester" },
			{ action: "rent", period: "year" },
			{ action: "partly-payment", period: "semester" },
			{ action: "partly-payment", period: "year" },
			{ action: "buy" },
			{ action: "sell" }
		];

		for (const action of actionList) {
			if (this.cartItemActionValidOnBranch(action.action)) {
				if (
					this.isActionValidOnItem(action.action, item, action.period)
				) {
					return action;
				}
			}
		}

		throw new Error("no action on item is valid");
	}

	public getFirstValidActionOnCartItem(
		cartItem: CartItem
	): { action: CartItemAction; period?: Period } {
		const actionList: { action: CartItemAction; period?: Period }[] = [
			{ action: "rent", period: "semester" },
			{ action: "rent", period: "year" },
			{ action: "partly-payment", period: "semester" },
			{ action: "partly-payment", period: "year" },
			{ action: "buy" },
			{ action: "sell" }
		];

		for (const action of actionList) {
			if (this.cartItemActionValidOnBranch(action.action)) {
				if (
					this.isActionValidOnCartItem(
						action.action,
						cartItem,
						action.period
					)
				) {
					return action;
				}
			}
		}

		throw new Error("no action on item is valid");
	}

	public orderItemTypeBasedOnAction(action: CartItemAction): OrderItemType {
		return action as OrderItemType;
	}

	public orderItemPriceBasedOnAction(
		action: CartItemAction,
		item: Item,
		alreadyPayed?: number,
		period?: Period
	): number {
		const alreadyPayedAmount = alreadyPayed ? alreadyPayed : 0;

		if (action === "rent" || action === "partly-payment") {
			return this._itemPriceService.rentPrice(
				item,
				period,
				1,
				alreadyPayedAmount
			);
		} else if (action === "buy") {
			return this._itemPriceService.buyPrice(item, alreadyPayedAmount);
		} else if (action === "sell") {
			return this._itemPriceService.sellPrice(item);
		}
	}

	private createDefaultOrderItemInfo(
		type: OrderItemType,
		period?: Period
	): any {
		if (type === "rent") {
			const fromTo = this._dateService.rentPeriod(period);

			return {
				from: fromTo.from,
				to: fromTo.to,
				numberOfPeriods: 1,
				periodType: period
			};
		} else if (type === "partly-payment") {
			const fromTo = this._dateService.partlyPaymentPeriod(period);

			return {
				from: fromTo.from,
				to: fromTo.to,
				periodType: period
			};
		}
	}
}
