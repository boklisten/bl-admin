import { Injectable } from "@angular/core";
import { CartService } from "../cart.service";
import { CustomerItem, Item, Order, OrderItem } from "@wizardcoder/bl-model";
import { OrderItemType } from "@wizardcoder/bl-model/dist/order/order-item/order-item-type";
import {
	OrderItemAmounts,
	OrderItemPriceService
} from "../../price/order-item-price/order-item-price.service";
import { OrderService } from "@wizardcoder/bl-connect";
import { OrderHelperService } from "../../order/order-helper/order-helper.service";
import { CustomerItemPriceService } from "../../price/customer-item-price/customer-item-price.service";
import { DateService } from "../../date/date.service";
import { Period } from "@wizardcoder/bl-model/dist/period/period";

@Injectable({
	providedIn: "root"
})
export class OrderItemHelperService {
	constructor(
		private _cartService: CartService,
		private _orderItemPriceService: OrderItemPriceService,
		private _orderHelperService: OrderHelperService,
		private _customerItemPriceService: CustomerItemPriceService,
		private _dateService: DateService,
		private _orderService: OrderService
	) {}

	public async updateOrderItem(
		type: OrderItemType,
		orderItem: OrderItem,
		item: Item,
		period?: Period,
		customerItem?: CustomerItem
	): Promise<OrderItem> {
		switch (type) {
			case "rent":
				return await this.updateOrderItemRent(orderItem, item, period);
			case "partly-payment":
				return await this.updateOrderItemPartlyPayment(
					orderItem,
					item,
					period
				);
			case "buy":
				return await this.updateOrderItemBuy(orderItem, item);
			case "sell":
				return await this.updateOrderItemSell(orderItem, item);
			case "buyout":
				return await this.updateOrderItemBuyout(
					orderItem,
					item,
					customerItem
				);
			case "return":
				return await this.updateOrderItemReturn(
					orderItem,
					customerItem,
					item
				);
			case "cancel":
				return await this.updateOrderItemCancel(
					orderItem,
					item,
					customerItem
				);
			case "extend":
				return await this.updateOrderItemExtend(
					orderItem,
					item,
					customerItem
				);
		}
	}

	private async updateOrderItemBuy(
		orderItem: OrderItem,
		item: Item
	): Promise<OrderItem> {
		orderItem.type = "buy";
		orderItem.delivered = true;
		orderItem.info = null;
		orderItem.handout = true;
		await this.updateOrderItemAmounts(orderItem, item);
		return orderItem;
	}

	private async updateOrderItemSell(
		orderItem: OrderItem,
		item: Item
	): Promise<OrderItem> {
		orderItem.type = "sell";
		orderItem.handout = false;
		orderItem.info = null;
		await this.updateOrderItemAmounts(orderItem, item);
		return orderItem;
	}

	private async updateOrderItemRent(
		orderItem: OrderItem,
		item: Item,
		period: Period
	): Promise<OrderItem> {
		orderItem.type = "rent";
		const fromToDate = this._dateService.rentPeriod(period);

		orderItem.info = {
			periodType: period,
			from: fromToDate.from,
			to: fromToDate.to,
			numberOfPeriods: 1
		};

		orderItem.handout = true;

		await this.updateOrderItemAmounts(orderItem, item);

		return orderItem;
	}

	private async updateOrderItemPartlyPayment(
		orderItem: OrderItem,
		item: Item,
		period: Period
	): Promise<OrderItem> {
		orderItem.type = "partly-payment";
		orderItem.age = "new";

		const fromToDate = this._dateService.partlyPaymentPeriod(period);

		orderItem.info = {
			periodType: period,
			from: fromToDate.from,
			to: fromToDate.to,
			numberOfPeriods: 1,
			amountLeftToPay: 0
		};

		orderItem.handout = true;

		await this.updateOrderItemAmounts(orderItem, item);

		return orderItem;
	}

	private async updateOrderItemBuyout(
		orderItem: OrderItem,
		item: Item,
		customerItem: CustomerItem
	): Promise<OrderItem> {
		orderItem.type = "buyout";
		orderItem.delivered = true;
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

		orderItem.taxRate = item.taxRate;
		orderItem.amount = orderItemAmounts.amount;
		orderItem.unitPrice = orderItemAmounts.unitPrice;
		orderItem.taxAmount = orderItemAmounts.taxAmount;
		orderItem.customerItem = customerItem.id;
		orderItem.info = null;

		return orderItem;
	}

	private async updateOrderItemReturn(
		orderItem: OrderItem,
		customerItem: CustomerItem,
		item: Item
	) {
		orderItem.type = "return";

		const orderItemAmounts: OrderItemAmounts = await this._customerItemPriceService.calculateAmountsReturn(
			customerItem,
			item
		);

		orderItem.taxRate = item.taxRate;
		orderItem.amount = orderItemAmounts.amount;
		orderItem.unitPrice = orderItemAmounts.unitPrice;
		orderItem.taxAmount = orderItemAmounts.taxAmount;
		orderItem.customerItem = customerItem.id;
		orderItem.info = null;

		return orderItem;
	}

	private async updateOrderItemCancel(
		orderItem: OrderItem,
		item: Item,
		customerItem?: CustomerItem
	): Promise<OrderItem> {
		orderItem.type = "cancel";

		if (!customerItem) {
			await this.updateOrderItemAmounts(orderItem, item);
		} else {
			const orderItemAmounts: OrderItemAmounts = await this._customerItemPriceService.calculateAmountsCancel(
				customerItem,
				item
			);
			orderItem.taxRate = item.taxRate;
			orderItem.amount = orderItemAmounts.amount;
			orderItem.unitPrice = orderItemAmounts.unitPrice;
			orderItem.taxAmount = orderItemAmounts.taxAmount;
			orderItem.info = null;
		}

		return orderItem;
	}

	private async updateOrderItemExtend(
		orderItem: OrderItem,
		item: Item,
		customerItem: CustomerItem
	): Promise<OrderItem> {
		orderItem.type = "extend";
		const periodType = "semester";
		const extendToFromDate = this._dateService.extendPeriod(periodType);

		orderItem.info = {
			from: extendToFromDate.from,
			to: extendToFromDate.to,
			numberOfPeriods: 1,
			periodType: periodType,
			customerItem: customerItem.id
		};

		const orderItemAmounts: OrderItemAmounts = this._customerItemPriceService.calculateAmountsExtend(
			customerItem,
			periodType,
			item
		);

		orderItem.taxRate = item.taxRate;
		orderItem.taxAmount = orderItemAmounts.taxAmount;
		orderItem.amount = orderItemAmounts.amount;
		orderItem.unitPrice = orderItemAmounts.unitPrice;

		return orderItem;
	}

	private async updateOrderItemAmounts(orderItem: OrderItem, item: Item) {
		let movedOrderAndOrderItem;

		try {
			movedOrderAndOrderItem = await this._orderHelperService.getMovedFromOrderAndOrderItem(
				orderItem
			);
		} catch (e) {
			movedOrderAndOrderItem = {
				movedFromOrder: null,
				movedFromOrderItem: null
			};
		}

		if (orderItem.type == "partly-payment") {
			let partlyPaymentAmounts = this._orderItemPriceService.pricePartlyPayment(
				orderItem,
				item,
        movedOrderAndOrderItem.movedFromOrderItem,
        movedOrderAndOrderItem.movedFromOrder
			);

			orderItem.info["amountLeftToPay"] =
				partlyPaymentAmounts.amountLeftToPay;
		}

		const orderItemAmounts = this._orderItemPriceService.calculateAmounts(
			orderItem,
			item,
			movedOrderAndOrderItem.movedFromOrderItem,
			movedOrderAndOrderItem.movedFromOrder
		);

		orderItem.amount = orderItemAmounts.amount;
		orderItem.taxRate = item.taxRate;
		orderItem.taxAmount = orderItemAmounts.taxAmount;
		orderItem.unitPrice = orderItemAmounts.unitPrice;
	}
}
