import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Branch} from '@boklisten/bl-model';
import {BranchService} from '@boklisten/bl-connect';
import {DatabaseExcelService} from '../../database/database-excel/database-excel.service';

@Component({
	selector: 'app-branch-edit-list',
	templateUrl: './branch-edit-list.component.html',
	styleUrls: ['./branch-edit-list.component.scss']
})
export class BranchEditListComponent implements OnInit, OnChanges {
	@Input() branches: Branch[];
	@Input() autoUpdate: boolean;
	@Input() uploadList: boolean;

	public selected: Branch[];
	public temp: Branch[];
	public editing: any;
	public updating: any;

	constructor(private _branchService: BranchService, private _databaseExcelService: DatabaseExcelService) {
		this.temp = [];
		this.selected = [];
		this.editing = {};
		this.updating = {};
	}

	ngOnInit() {
	}


	ngOnChanges(changes: SimpleChanges) {
		for (const propName in changes) {
			if (propName === 'branches' && this.branches) {
				this.temp = [...this.branches];
			}
		}
	}

	public onDownloadSelected() {
		this._databaseExcelService.objectsToExcelFile(this.selected, 'branches');
	}

	public onUpdateFilter(event) {
		const fil = event.target.value.toLowerCase();

		this.branches = this.temp.filter((branch: Branch) => {
			return (fil.length <= 0 || branch.name.toLowerCase().indexOf(fil) !== -1);
		});
	}

	onSelect({ selected }) {
		this.selected.splice(0, this.selected.length);
		this.selected.push(...selected);
	}


	public updateRowItem(rowIndex: number, colName: string) {
		this.editing[rowIndex + colName] = false;
		if (this.autoUpdate) {
			this.updateBranchToDb(rowIndex, colName);
		}
	}

	public updateBranchToDb(rowIndex: number, colName: string) {
		this.updating[rowIndex] = true;

		this._branchService.update(this.branches[rowIndex].id, this.branches[rowIndex]).then((updatedBranch: Branch) => {
			this.editing[rowIndex + colName] = false;
			this.updating[rowIndex] = false;
			this.branches[rowIndex] = updatedBranch;
			this.branches = [...this.branches];
		}).catch((updateError) => {
			console.log('branchEditListComponent: could not update branch');
		});
	}

	public onUploadSelected() {
		for (const selectedBranch of this.selected) {
			if (!selectedBranch.id || selectedBranch.id.length <= 0) {

				this._branchService.add(selectedBranch).then((addedBranch: Branch) => {
					this.removeFromBranches(addedBranch);
				}).catch((addError) => {
					console.log('branchEditListComponent: could not add branch');
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
