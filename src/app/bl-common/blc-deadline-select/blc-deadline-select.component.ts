import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BranchStoreService } from "../../branch/branch-store.service";

@Component({
	selector: "app-blc-deadline-select",
	templateUrl: "./blc-deadline-select.component.html",
	styleUrls: ["./blc-deadline-select.component.scss"]
})
export class BlcDeadlineSelectComponent implements OnInit {
	@Input() deadline: Date;
	@Output() deadlineChange: EventEmitter<Date>;
	public deadlineOptions: Date[];
	public customDeadline: boolean;

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
			this.deadlineChange.emit(this.deadline);
		}
	}

	private setDeadlineOptions() {
		let branch = this.branchStoreService.getCurrentBranch();

		for (let period of branch.paymentInfo.rentPeriods) {
			this.deadlineOptions.push(period.date);
		}

		this.selectDeadline(this.deadlineOptions[0]);
  }
}
