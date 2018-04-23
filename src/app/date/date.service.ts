import {Injectable} from '@angular/core';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {BranchStoreService} from '../branch/branch-store.service';
import * as moment from 'moment';

interface FromToDate {
	from: Date;
	to: Date;
}


@Injectable()
export class DateService {

	constructor(private _branchStoreService: BranchStoreService) {
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
