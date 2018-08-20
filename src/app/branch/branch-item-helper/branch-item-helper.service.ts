import {Injectable} from '@angular/core';
import {BranchItemStoreService} from '../branch-item-store/branch-item-store.service';
import {Item} from '@wizardcoder/bl-model';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {BranchStoreService} from '../branch-store.service';

@Injectable()
export class BranchItemHelperService {

	constructor(private _branchItemStoreService: BranchItemStoreService, private _branchStoreService: BranchStoreService) {

	}

	public isRentValid(item: Item, periodType: Period) {
		for (const branchItem of this._branchItemStoreService.getBranchItems()) {
			if (branchItem.item === item.id) {
				if (branchItem.rent) {
					for (const rentPeriod of this._branchStoreService.getCurrentBranch().paymentInfo.rentPeriods) {
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
