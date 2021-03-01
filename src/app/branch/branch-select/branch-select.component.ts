import { Component, OnInit } from "@angular/core";
import { Branch } from "@boklisten/bl-model";
import { BranchStoreService } from "../branch-store.service";
import { BlcSortService } from "../../bl-common/blc-sort/blc-sort.service";

@Component({
	selector: "app-branch-select",
	templateUrl: "./branch-select.component.html",
	styleUrls: ["./branch-select.component.scss"],
})
export class BranchSelectComponent implements OnInit {
	public branches: Branch[];
	public selectedBranch: Branch;

	constructor(
		private _branchStoreService: BranchStoreService,
		private blcSortService: BlcSortService
	) {}

	ngOnInit() {
		this._branchStoreService
			.getAllBranches()
			.then((branches: Branch[]) => {
				this.branches = this.blcSortService.sortByField(
					branches,
					"name"
				);
			})
			.catch(() => {
				console.log("branchSelectComponent: could not get branches");
			});

		this.selectedBranch = this._branchStoreService.getCurrentBranch();
	}

	public setBranch(branch: Branch) {
		this._branchStoreService.setCurrentBranch(branch);
		this.selectedBranch = branch;
	}
}
