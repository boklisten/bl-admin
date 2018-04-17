import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {BranchStoreService} from './branch-store.service';

@Injectable()
export class BranchGuardService implements CanActivate {

	constructor(private _branchStoreService: BranchStoreService, private _router: Router) {

	}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this._branchStoreService.getCurrentBranch()) {
			return true;
		}

		this._branchStoreService.redirectUrl = state.url;
		this._router.navigate(['/branch/select']);
		return false;
	}
}
