import { Injectable } from "@angular/core";
import { Branch } from "@wizardcoder/bl-model";
import { BranchService } from "@wizardcoder/bl-connect";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { StorageService } from "../storage/storage.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class BranchStoreService {
	public redirectUrl: string;
	private _branches: Branch[];
	private _currentBranch: Branch;
	private _branchChange$: Subject<Branch>;

	constructor(
		private _branchService: BranchService,
		private _router: Router,
		private _storageService: StorageService,
		private _authService: AuthService
	) {
		this._branchChange$ = new Subject<Branch>();
		this.redirectUrl = null;

		if (this._storageService.get("bl-branch")) {
			this._currentBranch = this._storageService.get("bl-branch");
			this._branchChange$.next(this._currentBranch);
		}

		this.getAllBranches()
			.then((branches: Branch[]) => {})
			.catch(() => {
				console.log("could not get all branches");
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

	public haveBranch(): boolean {
		return this._currentBranch !== null;
	}

	public getBranchId(): string {
		if (!this._currentBranch) {
			return null;
		}
		return this._currentBranch.id;
	}

	public setCurrentBranch(branch: Branch) {
		this._currentBranch = branch;
		this._storageService.store("bl-branch", branch);
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
