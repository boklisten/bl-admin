import { Injectable } from "@angular/core";
import { BranchStoreService } from "../../branch/branch-store.service";
import { Item } from "@boklisten/bl-model";
import { Period } from "@boklisten/bl-model/period/period";
import { BranchPriceService } from "../branch-price/branch-price.service";
import { PriceService } from "../price.service";
import { PriceInformation } from "../price-information";

@Injectable()
export class ItemPriceService {
	constructor(
		private _branchStoreService: BranchStoreService,
		private _branchPriceService: BranchPriceService,
		private _priceService: PriceService
	) {}

	public getRentPriceInformation(
		item: Item,
		period: Period
	): PriceInformation {
		const branch = this._branchStoreService.getCurrentBranch();

		if (branch.paymentInfo.responsible) {
			return this._priceService.getEmptyPriceInformation();
		}

		let amount;

		try {
			amount = this._branchPriceService.amountForRent(item, period);
		} catch (e) {
			throw e;
		}

		return this._priceService.calculatePriceInformation(
			amount,
			item.taxRate,
			0
		);
	}

	public getPartlyPaymentPriceInformation(
		item: Item,
		period: Period,
		itemAge: "new" | "used"
	): PriceInformation {
		const amountUpFront = this._branchPriceService.amountUpFrontForPartlyPayment(
			item,
			period,
			itemAge
		);

		const amountLeftToPay = this._branchPriceService.amountLeftToPayForPartyPayment(
			item,
			period,
			itemAge
		);

		return this._priceService.calculatePriceInformation(
			amountUpFront,
			item.taxRate,
			amountLeftToPay
		);
	}

	public getBuyPriceInformation(item: Item): PriceInformation {
		const amount = item.price;
		return this._priceService.calculatePriceInformation(
			amount,
			item.taxRate,
			0
		);
	}

	public getSellPriceInformation(item: Item): PriceInformation {
		const amount = this._branchPriceService.amountForSell(item);
		return this._priceService.calculatePriceInformation(
			amount,
			item.taxRate,
			0
		);
	}
}
