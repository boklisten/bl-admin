import {Injectable} from '@angular/core';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {BranchStoreService} from '../branch/branch-store.service';
import * as moment from 'moment';
import {b} from '@angular/core/src/render3';

interface FromToDate {
	from: Date;
	to: Date;
}


@Injectable()
export class DateService {

	constructor(private _branchStoreService: BranchStoreService) {
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

		return {from: new Date(), to: moment().add(6, 'months').toDate()};

	}

	private rentPeriodYear(): FromToDate {
		const branch = this._branchStoreService.getCurrentBranch();

		return {from: moment().toDate(), to: moment().add(1, 'year').toDate()};
	}



}
