import { Injectable } from "@angular/core";
import { Branch } from "@wizardcoder/bl-model";
import { Period } from "@wizardcoder/bl-model/dist/period/period";
import { CartItemAction } from "../../cart/cartItemAction";

@Injectable({
	providedIn: "root"
})
export class BranchHelperService {
	constructor() {}

	public actionValidOnBranch(
		branch: Branch,
		action: CartItemAction,
		period?: Period
	): boolean {
		switch (action) {
			case "rent":
				return this.isRentValid(branch, period);
			case "partly-payment":
				return this.isPartlyPaymentValid(branch, period);
			default:
				return true;
		}
	}

	public isRentValid(branch: Branch, period?: Period): boolean {
		if (
			branch.paymentInfo.rentPeriods &&
			branch.paymentInfo.rentPeriods.length > 0
		) {
			if (period !== undefined) {
				for (const periodInfo of branch.paymentInfo.rentPeriods) {
					if (periodInfo.type === period) {
						return true;
					}
				}
			}
			return true;
		}
		return false;
	}

	public isPartlyPaymentValid(branch: Branch, period?: Period): boolean {
		if (
			branch.paymentInfo.partlyPaymentPeriods &&
			branch.paymentInfo.partlyPaymentPeriods.length > 0
		) {
			if (period !== undefined) {
				for (const periodInfo of branch.paymentInfo
					.partlyPaymentPeriods) {
					if (periodInfo.type === period) {
						return true;
					}
				}
			}
			return true;
		}
		return false;
	}

	public getRentPeriod(branch: Branch, period: Period) {
		for (const rentPeriod of branch.paymentInfo.rentPeriods) {
			if (rentPeriod.type === period) {
				return rentPeriod;
			}
		}
	}

	public getPartlyPaymentPeriod(branch: Branch, period: Period) {
		for (const partlyPaymentPeriod of branch.paymentInfo
			.partlyPaymentPeriods) {
			if (partlyPaymentPeriod.type === period) {
				return partlyPaymentPeriod;
			}
		}

		return null;
	}

	public getExtendPeriod(branch: Branch, period: Period) {
		for (const rentPeriod of branch.paymentInfo.extendPeriods) {
			if (rentPeriod.type === period) {
				return rentPeriod;
			}
		}
	}
}
