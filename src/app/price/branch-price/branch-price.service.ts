import { Injectable } from "@angular/core";
import { BranchStoreService } from "../../branch/branch-store.service";
import { Branch, Item } from "@boklisten/bl-model";
import { Period } from "@boklisten/bl-model/dist/period/period";

@Injectable()
export class BranchPriceService {
	private _branch: Branch;

	constructor(private _branchStoreService: BranchStoreService) {
		this.handleBranchChange();
	}

	public amountForRent(item: Item, period: Period): number {
		return this.getAmountForRentPeriod(item, period);
	}

	public amountUpFrontForPartlyPayment(
		item: Item,
		period: Period,
		itemAge: "new" | "used"
	): number {
		return this.getAmountForPartlyPayment(
			item.price,
			period,
			itemAge,
			"upFront"
		);
	}

	public amountLeftToPayForPartyPayment(
		item: Item,
		period: Period,
		itemAge: "new" | "used"
	): number {
		return this.getAmountForPartlyPayment(
			item.price,
			period,
			itemAge,
			"amountLeftToPay"
		);
	}

	public amountForSell(item: Item): number {
		if (
			this._branch.paymentInfo &&
			this._branch.paymentInfo.sell &&
			this._branch.paymentInfo.sell.percentage
		) {
			return 0 - item.price * this._branch.paymentInfo.sell.percentage;
		}

		throw new Error("sell is not valid on branch");
	}

	private getAmountForPartlyPayment(
		price: number,
		period: Period,
		itemAge: "new" | "used",
		upFrontOrLeftToPay: "upFront" | "amountLeftToPay"
	) {
		const partlyPaymentPeriod = this.getPartlyPaymentPeriod(period);
		if (itemAge === "new") {
			if (upFrontOrLeftToPay === "upFront") {
				return price * partlyPaymentPeriod.percentageUpFront;
			} else {
				return price * partlyPaymentPeriod.percentageBuyout;
			}
		}

		if (itemAge === "used") {
			if (upFrontOrLeftToPay === "upFront") {
				return price * partlyPaymentPeriod.percentageUpFrontUsed;
			} else {
				return price * partlyPaymentPeriod.percentageBuyoutUsed;
			}
		}

		throw new Error(`itemAge "${itemAge}" is not valid`);
	}

	private getPartlyPaymentPeriod(
		period: Period
	): {
		percentageUpFront: number;
		percentageUpFrontUsed: number;
		percentageBuyout: number;
		percentageBuyoutUsed: number;
		type: Period;
		date: Date;
	} {
		for (const partlyPaymentPeriod of this._branch.paymentInfo
			.partlyPaymentPeriods) {
			if (partlyPaymentPeriod.type === period) {
				return partlyPaymentPeriod;
			}
		}
		throw new Error("period is not valid for partly-payment on branch");
	}

	private handleBranchChange() {
		this._branchStoreService.subscribe((branch) => {
			this._branch = branch;
		});
	}

	private getAmountForRentPeriod(item: Item, periodType: Period): number {
		for (const rentPeriod of this._branch.paymentInfo.rentPeriods) {
			if (rentPeriod.type === periodType) {
				return item.price * rentPeriod.percentage;
			}
		}
		return -1;
	}
}
