import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {BranchStoreService} from './branch-store.service';
import {BranchItemStoreService} from './branch-item-store/branch-item-store.service';

@Injectable()
export class BranchGuardService implements CanActivate {

	constructor(private _branchStoreService: BranchStoreService, private _branchItemStoreService: BranchItemStoreService, private _router: Router) {

	}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this._branchStoreService.getCurrentBranch()) {
				if (this._branchStoreService.getCurrentBranch().branchItems && this._branchStoreService.getCurrentBranch().branchItems.length > 0) {
					this._branchItemStoreService.fetchBranchItems().then(() => {
						resolve(true);
					}).catch(() => {
						reject(new Error('branchGuardService: could not get branch items'));
					});
				} else {
					resolve(true);
				}
			} else {

			this._branchStoreService.redirectUrl = state.url;
			this._router.navigate(['/branch/select']);
			reject(new Error('branchGuardService: could not get current branch'));

			}
		});
	}
}
