import { Injectable } from "@angular/core";
import { BranchStoreService } from "../../branch/branch-store.service";
import { Item } from "@wizardcoder/bl-model";
import { Period } from "@wizardcoder/bl-model/dist/period/period";
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
		const unitPrice = item.price;
		return this._priceService.calculatePriceInformation(
			unitPrice,
			item.taxRate,
			0
		);
	}

	public getSellPriceInformation(item: Item): PriceInformation {
		throw new Error("getSellPriceInformation(): not implemented");
	}
}
