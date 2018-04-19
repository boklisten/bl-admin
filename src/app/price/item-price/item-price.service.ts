import {Injectable} from '@angular/core';
import {BranchStoreService} from '../../branch/branch-store.service';
import {Item} from '@wizardcoder/bl-model';
import {Period} from '@wizardcoder/bl-model/dist/period/period';

@Injectable()
export class ItemPriceService {

	constructor(private _branchStoreService: BranchStoreService) {
	}


	rentPrice(item: Item, period: Period, numberOfPeriods: number): number {
		const branch = this._branchStoreService.getCurrentBranch();

		if (!branch.paymentInfo) {
			return -1;
		}

		for (const rentPeriod of branch.paymentInfo.rentPeriods) {
			if (rentPeriod.type === period) {
				return this.sanitizePrice((item.price * rentPeriod.percentage) * numberOfPeriods);
			}
		}
		return -1;
	}

	buyPrice(item: Item): number {
		return this.sanitizePrice(item.price);
	}

	sellPrice(item: Item): number {
		return this.sanitizePrice(item.sellPrice);
	}

	private sanitizePrice(price: number): number {
		return price;
	}

}
