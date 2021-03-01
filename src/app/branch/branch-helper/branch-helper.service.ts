import { Injectable } from "@angular/core";
import { Branch, CustomerItemType, Period } from "@boklisten/bl-model";
import { CartItemAction } from "../../cart/cart-item/cart-item-action";
import { BranchStoreService } from "../branch-store.service";

@Injectable({
	providedIn: "root",
})
export class BranchHelperService {
	private _branch: Branch;

	constructor(private branchStoreService: BranchStoreService) {
		this.handleBranchChange();
	}

	public actionValidOnBranch(
		branch: Branch,
		action: CartItemAction,
		period?: Period
	): boolean {
		switch (action.action) {
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

	public getExtendPeriod(period: Period) {
		for (const rentPeriod of this._branch.paymentInfo.extendPeriods) {
			if (rentPeriod.type === period) {
				return rentPeriod;
			}
		}
		throw new Error("extend period is not valid on branch");
	}

	public async getBranchesWithType(
		customerItemType: CustomerItemType,
		selectedBranches: string[]
	) {
		let filteredBranches = [];

		if (customerItemType === "loan") {
			const loanBranches = await this.getLoanBranches();

			if (selectedBranches.length > 0) {
				for (const branchId of selectedBranches) {
					if (loanBranches.indexOf(branchId) >= 0) {
						filteredBranches.push(branchId);
					}
				}
			} else {
				filteredBranches = loanBranches;
			}
			if (filteredBranches.length <= 0) {
				throw new Error(
					`none of the branches have 'loan' as a possebility`
				);
			}
		} else {
			const noLoanBranches = await this.getNoneLoanBranches();

			if (selectedBranches.length > 0) {
				for (const branchId of selectedBranches) {
					if (noLoanBranches.indexOf(branchId) >= 0) {
						filteredBranches.push(branchId);
					}
				}
			} else {
				filteredBranches = noLoanBranches;
			}
		}

		return filteredBranches;
	}

	public async getLoanBranches() {
		const branches = await this.branchStoreService.getAllBranches();

		const loanBranches = [];

		for (const branch of branches) {
			if (branch.paymentInfo.responsible) {
				loanBranches.push(branch.id);
			}
		}

		return loanBranches;
	}

	public async getNoneLoanBranches() {
		const branches = await this.branchStoreService.getAllBranches();

		const noneLoanBranches = [];

		for (const branch of branches) {
			if (!branch.paymentInfo.responsible) {
				noneLoanBranches.push(branch.id);
			}
		}

		return noneLoanBranches;
	}

	private handleBranchChange() {
		this.branchStoreService.subscribe((branch) => {
			this._branch = branch;
		});
	}
}
