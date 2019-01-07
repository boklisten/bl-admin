import { Injectable } from "@angular/core";
import { BranchItemStoreService } from "../branch-item-store/branch-item-store.service";
import { Item, BranchItem, Period } from "@wizardcoder/bl-model";
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
					for (const rentPeriod of this._branchStoreService.getCurrentBranch()
						.paymentInfo.rentPeriods) {
						if (rentPeriod.type === periodType) {
							return true;
						}
					}
					return false;
				} else {
					return false;
				}
			}
		}
		return true; // if item are not in the branchItem list of branch, all options are by default valid
	}

	public isPartlyPaymentValid(item: Item, period: Period): boolean {
		for (const branchItem of this._branchItemStoreService.getBranchItems()) {
			if (branchItem.item === item.id) {
				if (branchItem.partlyPaymentAtBranch) {
					for (const partlyPaymentPeriod of this._branchStoreService.getCurrentBranch()
						.paymentInfo.partlyPaymentPeriods) {
						if (partlyPaymentPeriod.type === period) {
							return true;
						}
					}
				}
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

	private getBranchItem(item: Item): BranchItem {
		for (const branchItem of this._branchItemStoreService.getBranchItems()) {
			if (branchItem.item === item.id) {
				return branchItem;
			}
		}
		return null;
	}

	public isBuyValid(item: Item) {
		return true; // if the item is not found, the action is allowed
	}

	public isSellValid(item: Item) {
		for (const branchItem of this._branchItemStoreService.getBranchItems()) {
			if (branchItem.item === item.id) {
				return branchItem.sell;
			}
		}
		return true; // if the item is not found, the action is allowed
	}
}
