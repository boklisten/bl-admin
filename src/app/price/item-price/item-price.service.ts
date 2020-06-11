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
		period: Period
	): PriceInformation {
		const branch = this._branchStoreService.getCurrentBranch();

		if (branch.paymentInfo.responsible) {
			return this._priceService.getEmptyPriceInformation();
		}

		let unitPrice;

		try {
			unitPrice = this._branchPriceService.unitPriceRent(item, period);
		} catch (e) {
			throw e;
		}

		return this._priceService.calculatePriceInformation(
			unitPrice,
			item.taxRate,
			0
		);
	}

	public getPartlyPaymentPriceInformation(
		item: Item,
		period: Period,
		itemAge: "new" | "used"
	): PriceInformation {
		let upFrontPrice;
		let amountLeftToPay;

		try {
			upFrontPrice = this._branchPriceService.upFrontPricePartlyPayment(
				item,
				period,
				itemAge
			);

			amountLeftToPay = this._branchPriceService.amountLeftToPayPartyPayment(
				item,
				period,
				itemAge
			);
			console.log("amount left to pay", amountLeftToPay);
		} catch (e) {
			throw e;
		}

		return this._priceService.calculatePriceInformation(
			upFrontPrice,
			item.taxRate,
			amountLeftToPay
		);
	}

	public getBuyPriceInformation(item: Item): PriceInformation {
		const unitPrice = item.price;
		return this._priceService.calculatePriceInformation(
			unitPrice,
			item.taxRate,
			0
		);
	}

	public getSellPriceInformation(item: Item): PriceInformation {
		const branch = this._branchStoreService.getCurrentBranch();

		if (
			branch.paymentInfo &&
			branch.paymentInfo.sell &&
			branch.paymentInfo.sell.percentage
		) {
			let unitPrice = -Math.abs(
				Math.floor(item.price * branch.paymentInfo.sell.percentage)
			);

			return this._priceService.calculatePriceInformation(
				unitPrice,
				item.taxRate,
				0
			);
		}
		throw new Error("sell is not valid on this item");
	}
}
