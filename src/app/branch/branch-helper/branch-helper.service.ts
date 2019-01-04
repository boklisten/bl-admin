import { Injectable } from "@angular/core";
import { Branch } from "@wizardcoder/bl-model";
import { Period } from "@wizardcoder/bl-model/dist/period/period";

@Injectable({
	providedIn: "root"
})
export class BranchHelperService {
	constructor() {}

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
	}

	public getExtendPeriod(branch: Branch, period: Period) {
		for (const rentPeriod of branch.paymentInfo.extendPeriods) {
			if (rentPeriod.type === period) {
				return rentPeriod;
			}
		}
	}
}
