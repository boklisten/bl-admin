import {Injectable} from '@angular/core';
import {Branch, CustomerItem, Item} from '@wizardcoder/bl-model';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {DateService} from '../../date/date.service';
import {BranchStoreService} from '../../branch/branch-store.service';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {PriceService} from '../price.service';

export interface OrderItemAmounts {
	unitPrice: number;
	amount: number;
	taxAmount: number;
}

@Injectable()
export class CustomerItemPriceService {

	constructor(private _dateService: DateService,
	            private _branchStoreService: BranchStoreService,
	            private _priceService: PriceService) {
	}

	public calculateAmountsBuyout(item: Item): OrderItemAmounts {
		const branch = this._branchStoreService.getCurrentBranch();
		const unitPrice = this._priceService.sanitize(item.price * branch.paymentInfo.buyout.percentage);
		return this.calculateOrderItemAmounts(unitPrice, item.taxRate);
	}

	public calculateAmountsExtend(customerItem: CustomerItem, period: Period, item: Item) {
		if (!this._dateService.isCustomerItemExtendValid(customerItem.deadline, period)) {
			throw new Error('extend period is not valid on customerItem');
		}

		const unitPrice = this.priceExtend(period);
		return this.calculateOrderItemAmounts(unitPrice, item.taxRate);
	}

	public calculateAmountsReturn(customerItem: CustomerItem, item: Item) {
		const unitPrice = this.priceReturn(customerItem);

		return this.calculateOrderItemAmounts(unitPrice, item.taxRate);

	}

	public calculateAmountsCancel(customerItem: CustomerItem, item: Item) {
		const unitPrice = this.priceCancel(customerItem);
		return this.calculateOrderItemAmounts(unitPrice, item.taxRate);
	}


	private calculateOrderItemAmounts(price: number, itemTaxRate: number): {amount: number, taxAmount: number, unitPrice: number} {

		const unitPrice = this._priceService.sanitize(price);
		const taxAmount = this._priceService.sanitize(unitPrice * itemTaxRate);
		const amount = this._priceService.sanitize(unitPrice + taxAmount);

		return {
			unitPrice: unitPrice,
			taxAmount: taxAmount,
			amount: amount
		};
	}

	public priceBuyout(item: Item): number {
		const branch = this._branchStoreService.getCurrentBranch();
		return item.price * branch.paymentInfo.buyout.percentage;
	}

	public priceExtend(period: Period, item?: Item): number {
		const branch = this._branchStoreService.getCurrentBranch();
		for (const extendPeriod of branch.paymentInfo.extendPeriods) {
			if (extendPeriod.type === period) {
				if (extendPeriod.percentage && item) {
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
