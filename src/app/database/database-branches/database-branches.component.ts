import { Component, OnInit } from "@angular/core";
import { BranchService } from "@wizardcoder/bl-connect";
import { Branch } from "@wizardcoder/bl-model";
import { BlcSortService } from "../../bl-common/blc-sort/blc-sort.service";

@Component({
	selector: "app-database-branches",
	templateUrl: "./database-branches.component.html",
	styleUrls: ["./database-branches.component.scss"]
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
				this.branches = this.blcSortService.sortByName(branches);
			})
			.catch(getBranchesError => {
				console.log(
					"databaseBranchesComponent: could not get branches",
					getBranchesError
				);
			});
	}
}
