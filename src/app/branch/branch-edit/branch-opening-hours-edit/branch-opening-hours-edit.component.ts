import { Component, Input, OnInit } from "@angular/core";
import { Branch, OpeningHour } from "@boklisten/bl-model";
import { OpeningHourService } from "@boklisten/bl-connect";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { OpeningHoursHandlerService } from "./opening-hours-handler.service";
import * as moment from "moment";

@Component({
	selector: "app-branch-opening-hours-edit",
	templateUrl: "./branch-opening-hours-edit.component.html",
	styleUrls: ["./branch-opening-hours-edit.component.scss"],
})
export class BranchOpeningHoursEditComponent implements OnInit {
	@Input() branch: Branch;
	public openingHours: OpeningHour[];
	public fromDay: { year: number; month: number; day: number };
	public fromTime: { hour: number; minute: number };
	public toTime: { hour: number; minute: number };
	private _modalRef: NgbModalRef;
	public minuteStep: number;
	public sortedOpeningHours: OpeningHour[];

	constructor(
		private _openingHourService: OpeningHourService,
		private _modalService: NgbModal,
		private _openingHoursHandlerService: OpeningHoursHandlerService
	) {
		this.openingHours = [];
		this.minuteStep = 15;
		const theDate = new Date();
		this.fromDay = {
			year: theDate.getFullYear(),
			month: theDate.getMonth(),
			day: theDate.getDay(),
		};
		this.fromTime = { hour: theDate.getHours(), minute: 0 };
		this.toTime = { hour: theDate.getHours() + 1, minute: 0 };
		this.sortedOpeningHours = [];
	}

	ngOnInit() {
		this._openingHourService
			.getManyByIds(this.branch.openingHours as string[])
			.then((openingHours: OpeningHour[]) => {
				this.openingHours = openingHours;
				this.sortOpeningHours();
			})
			.catch((getOpeningHoursError) => {
				console.log(
					"branchOpeningHoursEditComponent: could not get opening hours",
					getOpeningHoursError
				);
			});
	}

	onRemoveOpeningHour(index: number) {
		this._openingHoursHandlerService
			.remove(this.branch, this.openingHours[index])
			.then(() => {
				this.openingHours.splice(index, 1);
				this.sortOpeningHours();
			})
			.catch((removeOpeningHourError) => {
				console.log(
					"branchOpeningHoursEditComponent: could not remove opening hour",
					removeOpeningHourError
				);
			});
	}

	private sortOpeningHours() {
		this.sortedOpeningHours = this.openingHours;

		this.sortedOpeningHours.sort((a: OpeningHour, b: OpeningHour) => {
			return moment.utc(a.from).diff(moment.utc(b.from));
		});
	}

	onAddOpeningHour() {
		// Convert from zero-indexed month
		this.fromDay.month = this.fromDay.month - 1;
		const fromDate = moment(this.fromDay)
			.set("hour", this.fromTime.hour)
			.set("minute", this.fromTime.minute)
			.toDate();
		const toDate = moment(this.fromDay)
			.set("hour", this.toTime.hour)
			.set("minute", this.toTime.minute)
			.toDate();

		const newOpeningHour: OpeningHour = {
			from: fromDate,
			to: toDate,
			branch: this.branch.id,
		} as OpeningHour;

		this._openingHoursHandlerService
			.add(this.branch, newOpeningHour)
			.then((addedOpeningHour: OpeningHour) => {
				this.openingHours.push(addedOpeningHour);
				this._modalRef.close();
				const newFromDay = moment(new Date(newOpeningHour.from))
					.add(1, "d")
					.toDate();
				this.fromDay.year = newFromDay.getFullYear();
				this.fromDay.month = newFromDay.getMonth() + 1;
				this.fromDay.day = newFromDay.getDay() + 1;
				this.sortOpeningHours();
			})
			.catch((addOpeningHourError) => {
				console.log(
					"branchOpeningHoursEditComponent: could not add openingHour",
					addOpeningHourError
				);
			});
	}

	openAddOpeningHour(content) {
		this._modalRef = this._modalService.open(content, {
			size: "lg",
			centered: true,
		});
	}

	isOpeningHourValid(): boolean {
		return true;
	}
}
