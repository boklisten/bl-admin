import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from "@angular/core";
import { Branch } from "@boklisten/bl-model";
import { BranchService } from "@boklisten/bl-connect";
import { DatabaseExcelService } from "../../database/database-excel/database-excel.service";
import { BlcSortService } from "../../bl-common/blc-sort/blc-sort.service";

@Component({
	selector: "app-branch-edit-list",
	templateUrl: "./branch-edit-list.component.html",
	styleUrls: ["./branch-edit-list.component.scss"],
})
export class BranchEditListComponent implements OnInit, OnChanges {
	@Input() branches: Branch[];
	@Input() autoUpdate: boolean;
	@Input() uploadList: boolean;

	public selected: Branch[];
	public temp: Branch[];
	public editing: any;
	public updating: any;
	public prevSearch = "";
	public onlyActive = true;
	public showPrivateSchools = true;
	public showPublicSchools = true;

	constructor(
		private _branchService: BranchService,
		private blcSortService: BlcSortService,
		private _databaseExcelService: DatabaseExcelService
	) {
		this.temp = [];
		this.selected = [];
		this.editing = {};
		this.updating = {};
	}

	ngOnInit() {
		if (!this.uploadList) {
			this._branchService
				.get()
				.then((branches: Branch[]) => {
					this.branches = this.blcSortService.sortByField(
						branches,
						"name"
					);
					this.temp = this.branches;
					this.filterWithOptions();
				})
				.catch((getBranchesError) => {
					console.log(
						"databaseBranchesComponent: could not get branches",
						getBranchesError
					);
				});
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		for (const propName in changes) {
			if (propName === "branches" && this.branches) {
				this.temp = [...this.branches];
			}
		}
	}

	public onDownloadSelected() {
		this._databaseExcelService.objectsToExcelFile(
			this.selected,
			"branches"
		);
	}

	public onUpdateFilter(event) {
		const searchValue = event.target.value.toLowerCase();
		this.prevSearch = searchValue;

		this.filterWithOptions(searchValue);
	}

	filterWithOptions(searchValue?: string) {
		this.filterBySearch(searchValue ?? this.prevSearch);

		if (this.onlyActive) {
			this.branches = this.branches.filter(
				(branch) => branch.active === this.onlyActive
			);
		}

		if (!this.showPublicSchools) {
			this.branches = this.branches.filter(
				(branch) => !branch.type.toLowerCase().includes("vgs")
			);
		}

		if (!this.showPrivateSchools) {
			this.branches = this.branches.filter(
				(branch) => !branch.type.toLowerCase().includes("privat")
			);
		}
	}

	private filterBySearch(searchValue) {
		this.branches = this.temp.filter(
			(branch) =>
				searchValue.length === 0 ||
				branch.name.toLowerCase().includes(searchValue)
		);
	}

	onSelect({ selected }) {
		this.selected.splice(0, this.selected.length);
		this.selected.push(...selected);
	}

	public updateRowItem(rowIndex: number, colName: string) {
		this.editing[rowIndex + colName] = false;
		this.updateBranchToDb(rowIndex, colName);
	}

	public updateBranchToDb(rowIndex: number, colName: string) {
		this.updating[rowIndex] = true;

		this._branchService
			.update(this.branches[rowIndex].id, this.branches[rowIndex])
			.then((updatedBranch: Branch) => {
				this.editing[rowIndex + colName] = false;
				this.updating[rowIndex] = false;
				this.branches[rowIndex] = updatedBranch;
				this.branches = [...this.branches];
			})
			.catch((updateError) => {
				console.log("branchEditListComponent: could not update branch");
			});
	}

	public onUploadSelected() {
		for (const selectedBranch of this.selected) {
			if (!selectedBranch.id || selectedBranch.id.length <= 0) {
				this._branchService
					.add(selectedBranch)
					.then((addedBranch: Branch) => {
						this.removeFromBranches(addedBranch);
					})
					.catch((addError) => {
						console.log(
							"branchEditListComponent: could not add branch"
						);
					});
			}
		}
	}

	public removeFromBranches(branch: Branch) {
		for (let i = 0; i < this.branches.length; i++) {
			if (this.branches[i].name === branch.name) {
				this.branches.splice(i, 1);
				break;
			}
		}
		this.branches = [...this.branches];
	}
}
