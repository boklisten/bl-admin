import {Injectable} from '@angular/core';
import {BranchStoreService} from '../../branch/branch-store.service';
import {BranchItem, Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {MapType} from '@angular/compiler/src/output/output_ast';
import {BranchItemStoreService} from '../../branch/branch-item-store/branch-item-store.service';
import {BranchPriceService} from '../branch-price/branch-price.service';

@Injectable()
export class ItemPriceService {
	private _branchItems: BranchItem[];

	constructor(private _branchStoreService: BranchStoreService, private _branchPriceService: BranchPriceService) {
		this._branchItems = [];
	}


	public rentPrice(item: Item, period: Period, numberOfPeriods: number, alreadyPayed?: number): number {
		const branch = this._branchStoreService.getCurrentBranch();

		if (!branch.paymentInfo) {
			return -1;
		}

		if (branch.paymentInfo.responsible) {
			return this.sanitizePrice(0);
		}

		const branchPrice = this._branchPriceService.rentPrice(item, period, numberOfPeriods);

		if (branchPrice === -1) {
			return -1;
		}

		if (alreadyPayed) {
			return this.sanitizePrice(branchPrice - alreadyPayed);
		}

		return this.sanitizePrice(branchPrice);
	}

	public buyPrice(item: Item, alreadyPayed?: number): number {
		const branch = this._branchStoreService.getCurrentBranch();
		if (!branch.paymentInfo) {
			return this.sanitizePrice(-1);
		}

		if (alreadyPayed) {
			return this.sanitizePrice(item.price - alreadyPayed);
		}
		return this.sanitizePrice(item.price);
	}

	public sellPrice(item: Item): number {
		const branch = this._branchStoreService.getCurrentBranch();

		if (!branch.paymentInfo) {
			return this.sanitizePrice(-1);
		}

		// TODO: should update sell price calculation to follow new flow

		return this.sanitizePrice(-1);
	}

	private sanitizePrice(price: number): number {
		return price;
		// return (parseInt((price / 10).toString(), 10) + 1) * 10;
	}

}
