import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { DateService } from "../../../date/date.service";

@Component({
	selector: "app-blc-period-select",
	templateUrl: "./blc-period-select.component.html",
	styleUrls: ["./blc-period-select.component.scss"],
})
export class BlcPeriodSelectComponent implements OnInit {
	@Output() periodChange: EventEmitter<{ fromDate: Date; toDate: Date }>;

	public periodSelect: "day" | "semester" | "year" | "allTime" | "custom";
	public fromDate: Date;
	public toDate: Date;

	constructor(private _dateService: DateService) {
		this.periodChange = new EventEmitter();
		this.periodSelect = "day";
		this.fromDate = new Date();
		this.toDate = new Date();
	}

	ngOnInit() {
		this.selectPeriod(this.periodSelect);
	}

	public selectPeriod(period) {
		if (period === "day") {
			const dayPeriod = this._dateService.getCurrentDayPeriod();
			this.fromDate = dayPeriod.fromDate;
			this.toDate = dayPeriod.toDate;
		}

		if (period === "semester") {
			const semesterPeriod = this._dateService.getCurrentSemesterPeriod();
			this.fromDate = semesterPeriod.fromDate;
			this.toDate = semesterPeriod.toDate;
		}

		if (period === "year") {
			const yearPeriod = this._dateService.getYearPeriod();
			this.fromDate = yearPeriod.fromDate;
			this.toDate = yearPeriod.toDate;
		}

		if (period === "allTime") {
			const allTimePeriod = this._dateService.getAllTimePeriod();
			this.fromDate = allTimePeriod.fromDate;
			this.toDate = allTimePeriod.toDate;
		}

		this.periodChange.emit({
			fromDate: this.fromDate,
			toDate: this.toDate,
		});
	}

	onCustomDateChange() {
		this.periodChange.emit({
			fromDate: this.fromDate,
			toDate: this.toDate,
		});
	}
}
