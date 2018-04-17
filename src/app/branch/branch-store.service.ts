import {Injectable} from '@angular/core';
import {Branch} from '@wizardcoder/bl-model';
import {BranchService} from '@wizardcoder/bl-connect';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {StorageService} from '../storage/storage.service';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class BranchStoreService {
	public redirectUrl: string;
	private _branches: Branch[];
	private _currentBranch: Branch;
	private _branchChange$: Subject<Branch>;

	constructor(private _branchService: BranchService, private _router: Router, private _storageService: StorageService, private _authService: AuthService) {
		this._branchChange$ = new Subject<Branch>();
		this.redirectUrl = null;

		if (this._storageService.get('bl-branch')) {
			console.log('we have a saved branch', this._storageService.get('bl-branch'));
			this._currentBranch = this._storageService.get('bl-branch');
			this._branchChange$.next(this._currentBranch);
		}

		this.getAllBranches().then((branches: Branch[]) => {
			console.log('got all branches', branches);
		}).catch(() => {
			console.log('could not get all branches');
		});

		this.onLogout();
	}

	getAllBranches(): Promise<Branch[]> {
		if (this._branches) {
			return Promise.resolve(this._branches);
		}

		return this._branchService.get().then((branches: Branch[]) => {
			this._branches = branches;
			return this._branches;
		});
	}

	public getCurrentBranch(): Branch {
		return this._currentBranch;
	}

	public setCurrentBranch(branch: Branch) {
		this._currentBranch = branch;
		this._storageService.store('bl-branch', branch);
		this._branchChange$.next(this._currentBranch);

		if (this.redirectUrl) {
			this._router.navigateByUrl(this.redirectUrl);
			this.redirectUrl = null;
		}
	}

	public onBranchChange(): Observable<Branch> {
		return this._branchChange$;
	}

	private onLogout() {
		this._authService.onLogout().subscribe(() => {
			this._currentBranch = null;
		});
	}

}
