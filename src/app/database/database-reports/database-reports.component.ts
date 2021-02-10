import { Component, OnInit } from "@angular/core";
import { BranchStoreService } from "../../branch/branch-store.service";
import { Branch } from "@boklisten/bl-model";

@Component({
	selector: "app-database-reports",
	templateUrl: "./database-reports.component.html",
	styleUrls: ["./database-reports.component.scss"]
})
export class DatabaseReportsComponent implements OnInit {
	public currentBranchId: string;

	constructor(private branchStoreService: BranchStoreService) {}

	ngOnInit() {
		const branch: Branch = this.branchStoreService.getCurrentBranch();
		this.currentBranchId = branch.id;

		this.branchStoreService.onBranchChange().subscribe(() => {
			const branch: Branch = this.branchStoreService.getCurrentBranch();
			this.currentBranchId = branch.id;
		});
	}
}
