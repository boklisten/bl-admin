import {Injectable} from '@angular/core';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {BranchStoreService} from '../branch/branch-store.service';
import * as moment from 'moment';
import {BranchHelperService} from '../branch/branch-helper/branch-helper.service';

interface FromToDate {
	from: Date;
	to: Date;
}


@Injectable()
export class DateService {

	constructor(private _branchStoreService: BranchStoreService, private _branchHelperService: BranchHelperService) {
	}

	public currentDateCompact(): string {
		return moment().format('DD_MM_YY');
	}

	public isCustomerItemReturnValid(deadline: Date): boolean {
		return moment().isSameOrBefore(moment(deadline));
	}

	public isCustomerItemCancelValid(handoutDate: Date): boolean {
		return moment().isSameOrBefore(moment(handoutDate).add(2, 'week'));
	}

	public extendPeriod(period: Period): FromToDate {
		return this.rentPeriod(period);
	}

	public rentPeriod(period: Period): FromToDate {
		switch (period) {
			case 'semester':
				return this.rentPeriodSemester();
			case 'year':
				return this.rentPeriodYear();


		}
	}

	private rentPeriodSemester(): FromToDate {
		const branch = this._branchStoreService.getCurrentBranch();

		const rentPeriod = this._branchHelperService.getRentPeriod(branch, 'semester');

		if (!rentPeriod) {
			throw new Error('could not find period type on branch');
		}

		return {from: new Date(), to: rentPeriod.date};

	}

	private rentPeriodYear(): FromToDate {
		const branch = this._branchStoreService.getCurrentBranch();

		const rentPeriod = this._branchHelperService.getRentPeriod(branch, 'year');

		if (!rentPeriod) {
			throw new Error('could not find period type on branch');
		}

		return {from: new Date(), to: rentPeriod.date};

	}



}
