import {Component, OnInit} from '@angular/core';
import {Branch} from '@wizardcoder/bl-model';
import {BranchStoreService} from '../branch/branch-store.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	public currentBranch: Branch;

	constructor(private _branchStoreService: BranchStoreService) {
	}

	ngOnInit() {
		if (this._branchStoreService.getCurrentBranch()) {
			this.currentBranch = this._branchStoreService.getCurrentBranch();
		}

		this._branchStoreService.onBranchChange().subscribe((branch: Branch) => {
			this.currentBranch = branch;
		});
	}

}
