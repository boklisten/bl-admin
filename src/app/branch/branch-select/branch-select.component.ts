import {Component, OnInit} from '@angular/core';
import {Branch} from '@wizardcoder/bl-model';
import {BranchStoreService} from '../branch-store.service';

@Component({
	selector: 'app-branch-select',
	templateUrl: './branch-select.component.html',
	styleUrls: ['./branch-select.component.scss']
})
export class BranchSelectComponent implements OnInit {
	public branches: Branch[];
	public selectedBranch: Branch;

	constructor(private _branchStoreService: BranchStoreService) {
	}

	ngOnInit() {
		this._branchStoreService.getAllBranches().then((branches: Branch[]) => {
			this.branches = branches;
		}).catch(() => {
			console.log('branchSelectComponent: could not get branches');
		});

		this.selectedBranch = this._branchStoreService.getCurrentBranch();
	}

	public setBranch(branch: Branch) {
		this._branchStoreService.setCurrentBranch(branch);
		this.selectedBranch = branch;
	}

}
