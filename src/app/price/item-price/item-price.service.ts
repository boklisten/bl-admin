import {Injectable} from '@angular/core';
import {BranchStoreService} from '../../branch/branch-store.service';
import {Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';

@Injectable()
export class ItemPriceService {

	constructor(private _branchStoreService: BranchStoreService) {
	}

	public rentPrice(item: Item, period: Period, numberOfPeriods: number, alreadyPayed?: number): number {
		const branch = this._branchStoreService.getCurrentBranch();

		if (!branch.paymentInfo) {
			return -1;
		}

		if (branch.paymentInfo.responsible) {
			return this.sanitizePrice(0);
		}

		for (const rentPeriod of branch.paymentInfo.rentPeriods) {
			if (rentPeriod.type === period) {
				if (alreadyPayed) {
					return this.sanitizePrice(((item.price * rentPeriod.percentage) * numberOfPeriods) - alreadyPayed);
				}
				return this.sanitizePrice((item.price * rentPeriod.percentage) * numberOfPeriods);
			}
		}
		return -1;
	}

	public buyPrice(item: Item, alreadyPayed?: number): number {
		if (alreadyPayed) {
			return this.sanitizePrice(item.price - alreadyPayed);
		}
		return this.sanitizePrice(item.price);
	}

	public sellPrice(item: Item): number {
		if (item.sellPrice > 0) {
			return (this.sanitizePrice(0 - item.sellPrice));
		}
		return this.sanitizePrice(item.sellPrice);
	}

	private sanitizePrice(price: number): number {
		return price;
	}

}
