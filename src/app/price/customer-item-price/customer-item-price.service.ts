import { Injectable } from "@angular/core";
import { Branch, CustomerItem, Item, Order } from "@wizardcoder/bl-model";
import { Period } from "@wizardcoder/bl-model/dist/period/period";
import { DateService } from "../../date/date.service";
import { BranchStoreService } from "../../branch/branch-store.service";
import { OrderItemType } from "@wizardcoder/bl-model/dist/order/order-item/order-item-type";
import { PriceService } from "../price.service";
import { OrderService } from "@wizardcoder/bl-connect";
import { OrderHelperService } from "../../order/order-helper/order-helper.service";

export interface OrderItemAmounts {
	unitPrice: number;
	amount: number;
	taxAmount: number;
}

@Injectable()
export class CustomerItemPriceService {
	constructor(
		private _dateService: DateService,
		private _branchStoreService: BranchStoreService,
		private _orderService: OrderService,
		private _orderHelperService: OrderHelperService,
		private _priceService: PriceService
	) {}

	public calculateAmountsBuyout(item: Item): OrderItemAmounts {
		const branch = this._branchStoreService.getCurrentBranch();
		const unitPrice = this._priceService.sanitize(
			item.price * branch.paymentInfo.buyout.percentage
		);
		return this.calculateOrderItemAmounts(unitPrice, item.taxRate);
	}

	public calculateAmountPartlyPaymentBuyout(
		customerItem: CustomerItem,
		item: Item
	): OrderItemAmounts {
		if (!customerItem.type || customerItem.type !== "partly-payment") {
			throw new Error(
				`customerItem is not of type 'partly-payment' when asking for partly-payment amounts`
			);
		}

		const unitPrice = this._priceService.sanitize(
			customerItem.amountLeftToPay
		);
		return this.calculateOrderItemAmounts(unitPrice, item.taxRate);
	}

	public calculateAmountsExtend(
		customerItem: CustomerItem,
		period: Period,
		item: Item
	) {
		const unitPrice = this.priceExtend(period);
		return this.calculateOrderItemAmounts(unitPrice, item.taxRate);
	}

	public calculateAmountsReturn(customerItem: CustomerItem, item: Item) {
		const unitPrice = this.priceReturn(customerItem);

		return this.calculateOrderItemAmounts(unitPrice, item.taxRate);
	}

	public async calculateAmountsCancel(
		customerItem: CustomerItem,
		item: Item
	): Promise<OrderItemAmounts> {
		try {
			const unitPrice = await this.priceCancel(customerItem);
			return this.calculateOrderItemAmounts(unitPrice, item.taxRate);
		} catch (e) {
			throw new Error(
				"could not calculate orderItemAmounts for operation cancel: " +
					e
			);
		}
	}

	private calculateOrderItemAmounts(
		price: number,
		itemTaxRate: number
	): { amount: number; taxAmount: number; unitPrice: number } {
		const unitPrice = this._priceService.sanitize(price);
		const taxAmount = this._priceService.sanitize(unitPrice * itemTaxRate);
		const amount = this._priceService.sanitize(unitPrice + taxAmount);

		return {
			unitPrice: unitPrice,
			taxAmount: taxAmount,
			amount: amount
		};
	}

	public priceBuyout(item: Item): number {
		const branch = this._branchStoreService.getCurrentBranch();
		return item.price * branch.paymentInfo.buyout.percentage;
	}

	public priceExtend(period: Period, item?: Item): number {
		const branch = this._branchStoreService.getCurrentBranch();
		for (const extendPeriod of branch.paymentInfo.extendPeriods) {
			if (extendPeriod.type === period) {
				if (extendPeriod.percentage && item) {
					return item.price * extendPeriod.percentage;
				} else {
					return extendPeriod.price;
				}
			}
		}
	}

	public priceReturn(customerItem: CustomerItem) {
		// if the customerItem was handed out less than two weeks ago, the customer should get the money back
		if (customerItem.totalAmount && customerItem.handout) {
			return 0 - customerItem.totalAmount;
		}
		return 0;
	}

	public async priceCancel(customerItem: CustomerItem): Promise<number> {
		if (customerItem.handout && customerItem.handoutInfo) {
			let totalCancelAmount = 0;

			for (const orderId of customerItem.orders) {
				totalCancelAmount += await this.calculateOrderItemCancelAmount(
					orderId as string,
					customerItem.item as string
				);
			}

			return 0 - totalCancelAmount;
		}

		throw new Error("could not calculate total cancel amount");
	}

	private async calculateOrderItemCancelAmount(
		orderId: string,
		itemId: string
	): Promise<number> {
		const order = await this._orderService.getById(orderId);
		const orderItem = this._orderHelperService.getOrderItemFromOrder(
			itemId,
			order
		);

		if (orderItem.movedFromOrder) {
			return await this.calculateOrderItemCancelAmount(
				orderItem.movedFromOrder as string,
				itemId
			);
		}
		return orderItem.amount;
	}
}
