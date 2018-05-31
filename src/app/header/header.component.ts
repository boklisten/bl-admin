import {Component, OnInit} from '@angular/core';
import {Branch} from '@wizardcoder/bl-model';
import {BranchStoreService} from '../branch/branch-store.service';
import {AuthService} from '../auth/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	public currentBranch: Branch;
	public branches: Branch[];

	constructor(private _branchStoreService: BranchStoreService, private _authService: AuthService) {
	}

	ngOnInit() {
		if (this._branchStoreService.getCurrentBranch()) {
			this.currentBranch = this._branchStoreService.getCurrentBranch();
		}

		this._branchStoreService.onBranchChange().subscribe((branch: Branch) => {
			this.currentBranch = branch;
		});

		this._branchStoreService.getAllBranches().then((branches: Branch[]) => {
			this.branches = branches;
		}).catch((getBranchesError) => {
			console.log('HeaderComponent: could not get branches');
		});
	}

	public onSelectBranch(branch: Branch) {
		this._branchStoreService.setCurrentBranch(branch);
	}

	public onUserLogout() {
		this._authService.logout();
	}

}
