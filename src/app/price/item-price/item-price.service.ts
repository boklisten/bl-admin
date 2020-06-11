import { Injectable } from "@angular/core";
import { BranchStoreService } from "../../branch/branch-store.service";
import { BranchItem, Item, Order, OrderItem } from "@wizardcoder/bl-model";
import { Period } from "@wizardcoder/bl-model/dist/period/period";
import { OrderItemType } from "@wizardcoder/bl-model/dist/order/order-item/order-item-type";
import { MapType } from "@angular/compiler/src/output/output_ast";
import { BranchItemStoreService } from "../../branch/branch-item-store/branch-item-store.service";
import { BranchPriceService } from "../branch-price/branch-price.service";
import { BranchItemHelperService } from "../../branch/branch-item-helper/branch-item-helper.service";
import { PriceService } from "../price.service";
import { PriceInformation } from "../price-information";

@Injectable()
export class ItemPriceService {
	private _branchItems: BranchItem[];

	constructor(
		private _branchStoreService: BranchStoreService,
		private _branchPriceService: BranchPriceService,
		private _branchItemHelperService: BranchItemHelperService,
		private _priceService: PriceService
	) {
		this._branchItems = [];
	}

	public getRentPriceInformation(
		item: Item,
		period: Period,
		numberOfPeriods: number,
		alreadyPayed?: number,
		originalOrderItem?: OrderItem
	): PriceInformation {
		const branch = this._branchStoreService.getCurrentBranch();

		if (!branch.paymentInfo) {
			throw new Error("no branch set");
		}

		if (branch.paymentInfo.responsible) {
			return this.getEmptyPriceInformation();
		}

		let unitPrice;

		try {
			unitPrice = this._branchPriceService.unitPriceRent(
				item,
				period,
				numberOfPeriods
			);
		} catch (e) {
			throw e;
		}

		let priceInformation = this.getEmptyPriceInformation();
		priceInformation.unitPrice = unitPrice;
		priceInformation.taxRate = item.taxRate;
		priceInformation.taxAmount = unitPrice * item.taxRate;
		priceInformation.amount =
			priceInformation.unitPrice + priceInformation.taxAmount;
		priceInformation.amountLeftToPay = 0;
		return priceInformation;
	}

	private getEmptyPriceInformation(): PriceInformation {
		return {
			amount: 0,
			unitPrice: 0,
			taxRate: 0,
			taxAmount: 0,
			amountLeftToPay: 0,
			alreadyPayed: 0
		};
	}

	public partlyPaymentPrice(
		item: Item,
		period: Period,
		itemAge: "new" | "used",
		alreadyPayed?: number,
		originalOrderItem?: OrderItem
	): { upFront: number; amountLeftToPay: number } {
		const branch = this._branchStoreService.getCurrentBranch();

		if (!branch.paymentInfo) {
			return { upFront: -1, amountLeftToPay: -1 };
		}

		if (branch.paymentInfo.responsible) {
			return { upFront: 0, amountLeftToPay: 0 };
		}

		const branchPartlyPaymentUpFrontPrice = this._branchPriceService.partlyPaymentPrice(
			item,
			period,
			itemAge
		);

		let branchPartlyPaymentBuyoutPrice = -1;

		if (originalOrderItem) {
			branchPartlyPaymentBuyoutPrice =
				originalOrderItem.info["amountLeftToPay"];
		} else {
			branchPartlyPaymentBuyoutPrice = this._branchPriceService.getPartlyPaymentBuyoutPrice(
				item,
				period,
				itemAge
			);
		}

		if (
			branchPartlyPaymentUpFrontPrice === -1 ||
			branchPartlyPaymentBuyoutPrice === -1
		) {
			return { upFront: -1, amountLeftToPay: -1 };
		}

		const alreadyPayedAmount =
			alreadyPayed && alreadyPayed > 0 ? alreadyPayed : 0;

		return {
			upFront: this.calculateAmount(
				"partly-payment",
				branchPartlyPaymentUpFrontPrice,
				alreadyPayed,
				originalOrderItem,
				period
			),
			amountLeftToPay: this._priceService.sanitize(
				branchPartlyPaymentBuyoutPrice
			)
		};
	}

	public buyPrice(
		item: Item,
		alreadyPayed?: number,
		originalOrderItem?: OrderItem
	): number {
		if (!this._branchItemHelperService.isBuyValid(item)) {
			return -1;
		}

		return this.calculateAmount(
			"buy",
			item.price,
			alreadyPayed,
			originalOrderItem
		);
	}

	public sellPrice(item: Item): number {
		const branch = this._branchStoreService.getCurrentBranch();
		if (
			branch.paymentInfo &&
			branch.paymentInfo.sell &&
			branch.paymentInfo.sell.percentage
		) {
			return -Math.abs(
				this._priceService.sanitize(
					Math.floor(item.price * branch.paymentInfo.sell.percentage)
				)
			);
		}
		return -1;
	}

	private calculateAmount(
		orderItemType: OrderItemType,
		price: number,
		alreadyPayed?: number,
		originalOrderItem?: OrderItem,
		period?: Period
	): number {
		if (alreadyPayed) {
			if (originalOrderItem && originalOrderItem.type == orderItemType) {
				// if the order item is already payed for
				// it should return 0 as default;

				if (
					originalOrderItem.type == "rent" ||
					originalOrderItem.type == "partly-payment"
				) {
					if (originalOrderItem.info.periodType == period) {
						return 0;
					}
				} else {
					return 0;
				}
			}
			return this._priceService.sanitize(price - alreadyPayed);
		}

		return this._priceService.sanitize(price);
	}
}
