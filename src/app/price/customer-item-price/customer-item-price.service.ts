import {Injectable} from '@angular/core';
import {Branch, CustomerItem, Item} from '@wizardcoder/bl-model';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {DateService} from '../../date/date.service';
import {BranchStoreService} from '../../branch/branch-store.service';

@Injectable()
export class CustomerItemPriceService {

	constructor(private _dateService: DateService, private _branchStoreService: BranchStoreService) {
	}

	public priceBuyout(item: Item): number {
		const branch = this._branchStoreService.getCurrentBranch();
		return item.price * branch.paymentInfo.buyout.percentage;
	}

	public priceExtend(customerItem: CustomerItem, item: Item, period: Period): number {
		const branch = this._branchStoreService.getCurrentBranch();
		for (const extendPeriod of branch.paymentInfo.extendPeriods) {
			if (extendPeriod.type === period) {
				if (extendPeriod.percentage) {
					return item.price * extendPeriod.percentage;
				} else {
					return extendPeriod.price;
				}
			}
		}
	}

	public priceReturn(customerItem: CustomerItem) {
		// if the customerItem was handed out less than two weeks ago, the customer should get the money back
		if (customerItem.totalAmount && customerItem.handout && this._dateService.isCustomerItemCancelValid(customerItem.handoutInfo.time)) {
			return 0 - customerItem.totalAmount;
		}
		return 0;
	}

	public priceCancel(customerItem: CustomerItem) {
		// if the customer wants to cancel he should get his money back, but only if it is less than two weeks since handout
		if (customerItem.totalAmount && customerItem.handout && this._dateService.isCustomerItemCancelValid(customerItem.handoutInfo.time)) {
			return 0 - customerItem.totalAmount;
		}
		return 0;
	}
}
