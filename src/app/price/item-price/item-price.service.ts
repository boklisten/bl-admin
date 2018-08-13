import {Injectable} from '@angular/core';
import {BranchStoreService} from '../../branch/branch-store.service';
import {BranchItem, Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {MapType} from '@angular/compiler/src/output/output_ast';
import {BranchItemStoreService} from '../../branch/branch-item-store/branch-item-store.service';
import {BranchPriceService} from '../branch-price/branch-price.service';
import {BranchItemHelperService} from '../../branch/branch-item-helper/branch-item-helper.service';
import {PriceService} from '../price.service';

@Injectable()
export class ItemPriceService {
	private _branchItems: BranchItem[];

	constructor(private _branchStoreService: BranchStoreService,
	            private _branchPriceService: BranchPriceService,
	            private _branchItemHelperService: BranchItemHelperService,
	            private _priceService: PriceService
	) {
		this._branchItems = [];
	}


	public rentPrice(item: Item, period: Period, numberOfPeriods: number, alreadyPayed?: number): number {
		const branch = this._branchStoreService.getCurrentBranch();

		if (!branch.paymentInfo) {
			return -1;
		}

		if (branch.paymentInfo.responsible) {
			return 0;
		}

		const branchPrice = this._branchPriceService.rentPrice(item, period, numberOfPeriods);

		if (branchPrice === -1) {
			return -1;
		}

		if (alreadyPayed) {
			return this._priceService.sanitize(branchPrice - alreadyPayed);
		}

		return this._priceService.sanitize(branchPrice);
	}

	public buyPrice(item: Item, alreadyPayed?: number): number {
		if (!this._branchItemHelperService.isBuyValid(item)) {
			return -1;
		}

		if (alreadyPayed) {
			return this._priceService.sanitize(item.price - alreadyPayed);
		}
		return this._priceService.sanitize(item.price);
	}

	public sellPrice(item: Item): number {
		if (!this._branchItemHelperService.isSellValid(item)) {
			return -1;
		}

		// TODO: should update sell price calculation to follow new flow


		return this._priceService.sanitize(-1);
	}

}
