import { Injectable } from "@angular/core";
import {
	Branch,
	CustomerItem,
	Item,
	Order,
	OrderItem
} from "@wizardcoder/bl-model";
import { ItemPriceService } from "../item-price/item-price.service";
import { OrderItemType } from "@wizardcoder/bl-model/dist/order/order-item/order-item-type";
import { Period } from "@wizardcoder/bl-model/dist/period/period";
import { BranchStoreService } from "../../branch/branch-store.service";
import { PriceService } from "../price.service";
import { PriceInformation } from "../price-information";

export interface OrderItemAmounts {
	amount: number;
	unitPrice: number;
	taxAmount: number;
}

@Injectable()
export class OrderItemPriceService {
	constructor(
		private _itemPriceService: ItemPriceService,
		private _priceService: PriceService
	) {}

	public getRentPriceInformation(
		orderItem: OrderItem,
		item: Item,
		period: Period,
		alreadyPayed: boolean
	): PriceInformation {
		const rentPriceInformation = this._itemPriceService.getRentPriceInformation(
			item,
			period
		);

		if (alreadyPayed) {
			const originalPriceInformation = this._priceService.calculatePriceInformation(
				orderItem.amount,
				orderItem.taxRate
			);
			this.subtractPriceInformation(
				rentPriceInformation,
				originalPriceInformation
			);
		} else {
			return rentPriceInformation;
		}
	}

	public getPartlyPaymentPriceInformation(
		orderItem: OrderItem,
		item: Item,
		period: Period,
		itemAge: "new" | "used",
		alreadyPayed: boolean
	): PriceInformation {
		const partlyPaymentPriceInformation = this._itemPriceService.getPartlyPaymentPriceInformation(
			item,
			period,
			itemAge
		);

		if (alreadyPayed) {
			const originalPriceInformation = this._priceService.calculatePriceInformation(
				orderItem.amount,
				orderItem.taxRate,
				0
			);
			return this.subtractPriceInformation(
				partlyPaymentPriceInformation,
				originalPriceInformation
			);
		}
		return partlyPaymentPriceInformation;
	}

	public getBuyPriceInformation(
		orderItem: OrderItem,
		item: Item,
		alreadyPayed: boolean
	): PriceInformation {
		const buyPriceInformation = this._itemPriceService.getBuyPriceInformation(
			item
		);
		if (alreadyPayed) {
			const originalPriceInformation = this._priceService.calculatePriceInformation(
				orderItem.amount,
				orderItem.taxRate,
				0
			);
			return this.subtractPriceInformation(
				originalPriceInformation,
				buyPriceInformation
			);
		}
		return buyPriceInformation;
	}

	public getCancelPriceInformation(
		orderItem: OrderItem,
		alreadyPayed: boolean
	): PriceInformation {
		if (alreadyPayed) {
			return this._priceService.calculatePriceInformation(
				0 - orderItem.amount,
				orderItem.taxRate,
				0
			);
		}
		return this._priceService.getEmptyPriceInformation();
	}

	private subtractPriceInformation(
		originalPriceInformation: PriceInformation,
		priceInformation: PriceInformation
	): PriceInformation {
		let amount = originalPriceInformation.amount - priceInformation.amount;
		return this._priceService.calculatePriceInformation(
			amount,
			priceInformation.taxRate,
			priceInformation.amountLeftToPay
		);
	}

	public calculateAmounts(
		orderItem: OrderItem,
		item: Item,
		originalOrderItem?: OrderItem,
		originalOrder?: Order
	): OrderItemAmounts {
		let unitPrice = 0;
		if (orderItem.type === "rent") {
			unitPrice = this.priceRent(
				orderItem,
				item,
				originalOrderItem,
				originalOrder
			);
		} else if (orderItem.type === "buy") {
			unitPrice = this.priceBuy(item, originalOrderItem, originalOrder);
		} else if (orderItem.type === "sell") {
			unitPrice = this.priceSell(item);
		} else if (orderItem.type === "cancel") {
			unitPrice = this.priceCancel(originalOrderItem, originalOrder);
		} else if (orderItem.type === "partly-payment") {
			unitPrice = this.pricePartlyPayment(
				orderItem,
				item,
				originalOrderItem,
				originalOrder
			).upFront;
		}

		unitPrice = this._priceService.sanitize(unitPrice);
		const taxAmount = this._priceService.sanitize(
			this.calculateTaxAmount(orderItem.taxRate, unitPrice)
		);
		const amount = this._priceService.sanitize(
			this.calculateOrderItemAmount(unitPrice, taxAmount)
		);

		return {
			amount: amount,
			unitPrice: unitPrice,
			taxAmount: taxAmount
		};
	}

	private calculateTaxAmount(taxRate: number, unitPrice: number): number {
		return taxRate * unitPrice;
	}

	private calculateOrderItemAmount(
		unitPrice: number,
		taxAmount: number
	): number {
		return unitPrice + taxAmount;
	}

	public priceRent(
		orderItem: OrderItem,
		item: Item,
		originalOrderItem?: OrderItem,
		originalOrder?: Order
	): number {
		/*
		return this._itemPriceService.rentPrice(
			item,
			orderItem.info.periodType,
			orderItem.info.numberOfPeriods,
      this.alreadyPayed(originalOrderItem, originalOrder),
      originalOrderItem
		);
    */
		return -1;
	}

	public priceBuy(
		item: Item,
		originalOrderItem?: OrderItem,
		originalOrder?: Order
	): number {
		return -1;
		/*
		return this._itemPriceService.buyPrice(
			item,
			this.alreadyPayed(originalOrderItem, originalOrder),
			originalOrderItem
		);*/
	}

	public priceSell(item: Item): number {
		return -1;
		/*
		return this._itemPriceService.sellPrice(item);
    */
	}

	public priceCancel(
		originalOrderItem?: OrderItem,
		originalOrder?: Order
	): number {
		return 0 - this.alreadyPayed(originalOrderItem, originalOrder);
	}

	public pricePartlyPayment(
		orderItem: OrderItem,
		item: Item,
		originalOrderItem?: OrderItem,
		originalOrder?: Order
	): { upFront: number; amountLeftToPay: number } {
		/*
		return this._itemPriceService.partlyPaymentPrice(
			item,
			orderItem.info.periodType,
			orderItem.age ? orderItem.age : "new",
			this.alreadyPayed(originalOrderItem, originalOrder),
			originalOrderItem
		);
    */
		return { upFront: 0, amountLeftToPay: 0 };
	}

	public orderItemTypePayedFor(
		orderItem: OrderItem,
		originalOrderItem: OrderItem,
		originalOrder: Order
	): boolean {
		if (
			!originalOrderItem ||
			(!originalOrder.payments || originalOrder.payments.length <= 0)
		) {
			return false;
		}

		if (originalOrderItem.item === orderItem.item) {
			if (originalOrderItem.type === orderItem.type) {
				if (
					orderItem.type === "rent" ||
					orderItem.type === "extend" ||
					orderItem.type === "partly-payment"
				) {
					if (
						originalOrderItem.info.periodType !==
						orderItem.info.periodType
					) {
						return false;
					}
				}
				return true;
			}
		}

		return false;
	}

	public alreadyPayed(
		originalOrderItem?: OrderItem,
		originalOrder?: Order
	): number {
		return originalOrderItem &&
			(originalOrder.payments && originalOrder.payments.length > 0)
			? originalOrderItem.amount
			: 0;
	}
}
