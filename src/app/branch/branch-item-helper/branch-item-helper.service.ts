import { Injectable } from "@angular/core";
import { BranchItemStoreService } from "../branch-item-store/branch-item-store.service";
import { Item, BranchItem, Period } from "@boklisten/bl-model";
import { BranchStoreService } from "../branch-store.service";

@Injectable()
export class BranchItemHelperService {
	private defaultPeriod;

	constructor(
		private _branchItemStoreService: BranchItemStoreService,
		private _branchStoreService: BranchStoreService
	) {
		this.defaultPeriod = "semester";
	}

	public isRentValid(item: Item, periodType: Period): boolean {
		for (const branchItem of this._branchItemStoreService.getBranchItems()) {
			if (branchItem.item === item.id) {
				if (branchItem.rentAtBranch) {
					return this.rentPeriodValidOnCurrentBranch(periodType);
				} else {
					return false;
				}
			}
		}
		return false;
	}

	public isBuyValid(item: Item) {
		/*for (const branchItem of this._branchItemStoreService.getBranchItems()) {*/
		//if (branchItem.item === item.id) {
		//return branchItem.buyAtBranch;
		//}
		/*}*/
		return true; // if the item is not found, the action is allowed
	}

	public isSellValid(item: Item) {
		return item.buyback;
	}

	public isPartlyPaymentValid(item: Item, period: Period): boolean {
		if (!this.isPartlyPaymentPeriodValid(period)) {
			return false;
		}

		for (const branchItem of this._branchItemStoreService.getBranchItems()) {
			if (branchItem.item === item.id) {
				if (branchItem.partlyPaymentAtBranch) {
					return true;
				}
				return false;
			}
		}

		return true;
	}

	private isPartlyPaymentPeriodValid(period: Period) {
		let partlyPaymentPeriods = [];
		const currentBranch = this._branchStoreService.getCurrentBranch();

		if (currentBranch.paymentInfo) {
			partlyPaymentPeriods =
				currentBranch.paymentInfo.partlyPaymentPeriods;
			partlyPaymentPeriods = partlyPaymentPeriods
				? partlyPaymentPeriods
				: [];
		}
		for (const partlyPaymentPeriod of partlyPaymentPeriods) {
			if (partlyPaymentPeriod.type === period) {
				return true;
			}
		}
		return false;
	}

	public getDeadlineForRentPeriod(period: Period): Date {
		const branch = this._branchStoreService.getCurrentBranch();
		const rentPeriods = branch.paymentInfo
			? branch.paymentInfo.rentPeriods
			: [];

		for (let rentPeriod of rentPeriods) {
			if (rentPeriod.type === period) {
				return rentPeriod.date;
			}
		}
		throw new Error("rent period is not valid");
	}

	public getDeadlineForPartlyPaymentPeriod(period: Period): Date {
		const branch = this._branchStoreService.getCurrentBranch();
		const partlyPaymentPeriods = branch.paymentInfo
			? branch.paymentInfo.partlyPaymentPeriods
			: [];

		for (let partlyPaymentPeriod of partlyPaymentPeriods) {
			if (partlyPaymentPeriod.type === period) {
				return partlyPaymentPeriod.date;
			}
		}
		throw new Error("partly-payment period is not valid");
	}

	public getDefaultPartlyPaymentPeriod(item: Item): Period {
		const branchItem = this.getBranchItem(item);

		if (!branchItem) {
			return this.defaultPeriod;
		}

		if (!branchItem.partlyPaymentAtBranch) {
			throw new Error("partly payment not valid on branchItem");
		}

		let partlyPaymentPeriods = this._branchStoreService.getCurrentBranch()
			.paymentInfo.partlyPaymentPeriods;

		if (partlyPaymentPeriods && partlyPaymentPeriods.length > 0) {
			return partlyPaymentPeriods[0].type;
		}

		return this.defaultPeriod;
	}

	private rentPeriodValidOnCurrentBranch(period) {
		const branch = this._branchStoreService.getCurrentBranch();
		const rentPeriods = branch.paymentInfo
			? branch.paymentInfo.rentPeriods
			: [];
		for (const rentPeriod of rentPeriods) {
			if (rentPeriod.type === period) {
				return true;
			}
		}
		return false;
	}

	public getDefaultRentPeriod(item: Item): Period {
		const branchItem = this.getBranchItem(item);
		if (!branchItem.rentAtBranch) {
			throw new Error("rent not valid on branchItem");
		}

		let rentPeriods = this._branchStoreService.getCurrentBranch()
			.paymentInfo.rentPeriods;

		if (rentPeriods && rentPeriods.length > 0) {
			return rentPeriods[0].type;
		}

		return this.defaultPeriod;
	}

	private getBranchItem(item: Item): BranchItem {
		for (const branchItem of this._branchItemStoreService.getBranchItems()) {
			if (branchItem.item === item.id) {
				return branchItem;
			}
		}
		return null;
	}
}
