import { Injectable } from "@angular/core";
import { Period } from "@wizardcoder/bl-model/dist/period/period";
import { BranchStoreService } from "../branch/branch-store.service";
import * as moment from "moment";
import { BranchHelperService } from "../branch/branch-helper/branch-helper.service";
import { from } from "rxjs/internal/observable/from";

interface FromToDate {
	from: Date;
	to: Date;
}

@Injectable()
export class DateService {
	numOfPeriodsCancel: number;
	cancelPeriod: string;

	private _defaultSpringSemesterDeadlineDate;
	private _defaultFallSemesterDeadlineDate;

	constructor(
		private _branchStoreService: BranchStoreService,
		private _branchHelperService: BranchHelperService
	) {
		this._defaultSpringSemesterDeadlineDate = moment()
			.month(6)
			.date(1)
			.set("hour", 0)
			.set("minute", 0)
			.set("seconds", 0)
			.set("ms", 0);

		this._defaultFallSemesterDeadlineDate = moment()
			.month(11)
			.date(20)
			.set("hour", 0)
			.set("minute", 0)
			.set("seconds", 0)
			.set("ms", 0);
	}

	public currentDateCompact(): string {
		return moment().format("DD_MM_YY");
	}

	private getCurrentDate() {
		return moment()
			.set("hour", 0)
			.set("minutes", 0)
			.set("seconds", 0)
			.set("ms", 0);
	}

	public getCurrentDayPeriod(): { fromDate: Date; toDate: Date } {
		const currentDate = this.getCurrentDate();

		return {
			fromDate: currentDate.toDate(),
			toDate: currentDate.add(1, "day").toDate()
		};
	}

	public getPartlyPaymentPeriodDate(period: Period) {
		const branch = this._branchStoreService.getCurrentBranch();

		for (const partlyPaymentPeriod of branch.paymentInfo
			.partlyPaymentPeriods) {
			if (partlyPaymentPeriod.type === period) {
				return partlyPaymentPeriod.date;
			}
		}
	}

	public getCurrentSemesterPeriod(): { fromDate: Date; toDate: Date } {
		if (
			moment().isAfter(this._defaultSpringSemesterDeadlineDate) &&
			moment().isSameOrBefore(this._defaultFallSemesterDeadlineDate)
		) {
			// the current semester is the fall semester
			return {
				fromDate: this._defaultSpringSemesterDeadlineDate.toDate(),
				toDate: this._defaultFallSemesterDeadlineDate.toDate()
			};
		} else {
			// the current semester is the spring semester
			const lastYearsFallDeadline = this._defaultFallSemesterDeadlineDate.subtract(
				1,
				"year"
			);
			return {
				fromDate: lastYearsFallDeadline.toDate(),
				toDate: this._defaultSpringSemesterDeadlineDate.toDate()
			};
		}
	}

	public getYearPeriod(): { fromDate: Date; toDate: Date } {
		const toDate = this.getCurrentDate().add(1, "day");
		const fromDate = this.getCurrentDate().subtract(1, "year");
		return {
			fromDate: fromDate.toDate(),
			toDate: toDate.toDate()
		};
	}

	public getAllTimePeriod(): { fromDate: Date; toDate: Date } {
		return {
			fromDate: moment()
				.year(2000)
				.date(1)
				.month(1)
				.hour(0)
				.minute(0)
				.second(0)
				.millisecond(0)
				.toDate(),
			toDate: this.getCurrentDate().toDate()
		};
	}

	public isCustomerItemReturnValid(deadline: Date): boolean {
		return true;
		//return moment().isSameOrBefore(moment(deadline));
	}

	public isCustomerItemCancelValid(handoutDate: Date): boolean {
		return moment().isSameOrBefore(moment(handoutDate).add(2, "week"));
	}

	public isOrderItemCancelValid(orderDate: Date): boolean {
		return moment().isSameOrBefore(moment(orderDate).add(2, "week"));
	}

	public isCustomerItemExtendValid(
		currentDeadline: Date,
		period: Period
	): boolean {
		return true;
		/*
		try {
			const fromToDate = this.extendPeriod(period);
			return (moment(currentDeadline).isBefore(moment(fromToDate.to)));
		} catch (e) {
			return false;
    }
     */
	}

	public extendPeriod(period: Period): FromToDate {
		const branch = this._branchStoreService.getCurrentBranch();

		const extendPeriod = this._branchHelperService.getExtendPeriod(
			branch,
			period
		);

		if (!extendPeriod) {
			throw new Error("could not find extend period type on branch");
		}

		return { from: new Date(), to: extendPeriod.date };
	}

	public rentPeriod(period: Period): FromToDate {
		switch (period) {
			case "semester":
				return this.rentPeriodSemester();
			case "year":
				return this.rentPeriodYear();
		}
	}

	public partlyPaymentPeriod(period: Period): FromToDate {
		const branch = this._branchStoreService.getCurrentBranch();
		const partlyPaymentPeriod = this._branchHelperService.getPartlyPaymentPeriod(
			branch,
			period
		);

		if (!partlyPaymentPeriod) {
			throw new Error("could not get partly payment period");
		}

		return {
			from: new Date(),
			to: partlyPaymentPeriod.date
		};
	}

	private rentPeriodSemester(): FromToDate {
		const branch = this._branchStoreService.getCurrentBranch();

		const rentPeriod = this._branchHelperService.getRentPeriod(
			branch,
			"semester"
		);

		if (!rentPeriod) {
			throw new Error("could not find period type on branch");
		}

		return { from: new Date(), to: rentPeriod.date };
	}

	private rentPeriodYear(): FromToDate {
		const branch = this._branchStoreService.getCurrentBranch();

		const rentPeriod = this._branchHelperService.getRentPeriod(
			branch,
			"year"
		);

		if (!rentPeriod) {
			throw new Error("could not find period type on branch");
		}

		return { from: new Date(), to: rentPeriod.date };
	}
}
