import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BranchStoreService } from "../../branch/branch-store.service";

@Component({
	selector: "app-blc-deadline-select",
	templateUrl: "./blc-deadline-select.component.html",
	styleUrls: ["./blc-deadline-select.component.scss"],
})
export class BlcDeadlineSelectComponent implements OnInit {
	@Input() deadline: Date;
	@Output() deadlineChange: EventEmitter<Date>;
	public deadlineOptions: Date[];
	public customDeadline: boolean;
	public today: Date;

	public readonly MS_IN_DAY: number = 8.64e7;

	constructor(private branchStoreService: BranchStoreService) {
		this.deadlineChange = new EventEmitter<Date>();
	}

	ngOnInit() {
		this.deadlineOptions = [];
		this.customDeadline = false;
		this.setDeadlineOptions();
	}

	public selectDeadline(deadline: any) {
		if (typeof deadline == "string" && deadline === "custom") {
			this.customDeadline = true;
			this.deadlineChange.emit(new Date());
		} else {
			this.customDeadline = false;
			this.deadlineChange.emit(deadline);
		}
	}

	private setDeadlineOptions() {
		const today = new Date();
		this.today = today;
		const summerDeadline = new Date(today.getFullYear(), 6, 1);
		const winterDeadline = new Date(today.getFullYear(), 11, 20);
		// Continue to show the deadline for a month afterwards, with warning
		const summerDeadlinePlusGracePeriod = new Date(
			summerDeadline.getFullYear(),
			7,
			1
		);
		const winterDeadlinePlusGracePeriod = new Date(
			winterDeadline.getFullYear() + 1,
			0,
			20
		);

		if (today > summerDeadlinePlusGracePeriod) {
			summerDeadline.setFullYear(today.getFullYear() + 1);
		}
		if (today > winterDeadlinePlusGracePeriod) {
			winterDeadline.setFullYear(today.getFullYear() + 1);
		}

		let usualDates = [summerDeadline, winterDeadline];
		if (summerDeadline > winterDeadline) {
			usualDates = [winterDeadline, summerDeadline];
		}

		this.deadlineOptions = usualDates;
		this.selectDeadline(this.deadlineOptions[0]);
	}
}
