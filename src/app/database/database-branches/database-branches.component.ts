import { Component, OnInit } from "@angular/core";
import { BranchService } from "@boklisten/bl-connect";
import { Branch } from "@boklisten/bl-model";
import { BlcSortService } from "../../bl-common/blc-sort/blc-sort.service";

@Component({
	selector: "app-database-branches",
	templateUrl: "./database-branches.component.html",
	styleUrls: ["./database-branches.component.scss"],
})
export class DatabaseBranchesComponent implements OnInit {
	public branches: Branch[];
	constructor(
		private _branchService: BranchService,
		private blcSortService: BlcSortService
	) {}

	ngOnInit() {
		this._branchService
			.get()
			.then((branches: Branch[]) => {
				this.branches = this.blcSortService.sortByField(
					branches,
					"name"
				);
			})
			.catch((getBranchesError) => {
				console.log(
					"databaseBranchesComponent: could not get branches",
					getBranchesError
				);
			});
	}
}
