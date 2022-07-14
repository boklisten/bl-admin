import { Injectable } from "@angular/core";
import { Branch } from "@boklisten/bl-model";
import { BranchService } from "@boklisten/bl-connect";
import { Subject, Observable, Subscription, ReplaySubject } from "rxjs";
import { Router } from "@angular/router";
import { StorageService } from "../storage/storage.service";
import { AuthService } from "../auth/auth.service";

@Injectable({
	providedIn: "root",
})
export class BranchStoreService {
	public redirectUrl: string;
	private _branches: Branch[];
	private _currentBranch: Branch;
	private _branchChange$: Subject<Branch>;

	private _branch$: ReplaySubject<Branch>;
	private _branches$: ReplaySubject<Branch>;
	private _wait$: Subject<boolean>;

	constructor(
		private _branchService: BranchService,
		private _router: Router,
		private _storageService: StorageService,
		private _authService: AuthService
	) {
		this._branch$ = new ReplaySubject(1);
		this._branches$ = new ReplaySubject(1);
		this._wait$ = new Subject();

		this._branchChange$ = new Subject<Branch>();
		this.redirectUrl = null;
		if (this._storageService.get("bl-branch")) {
			const storedBranchId = this._storageService.get("bl-branch");

			if (typeof storedBranchId === "string") {
				this.fetchAndStoreBranchInfo(storedBranchId);
			} else {
				this._authService.logout();
			}
		}
		this.getAllBranches()
			.then((branches: Branch[]) => {})
			.catch(() => {
				console.log("could not get all branches");
			});

		this.onLogout();
	}

	private async fetchAndStoreBranchInfo(branchID: string) {
		this.setBranch({} as Branch);
		let branch: Branch;
		try {
			branch = await this._branchService.getById(branchID);
		} catch (e) {
			this._authService.logout();
		}
		this._currentBranch = branch;
		this._branchChange$.next(branch);
		this.setBranch(branch);
	}

	public subscribe(func: (branch: Branch) => void): Subscription {
		return this._branch$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	public set(branch: Branch) {
		this.setBranch(branch);
	}

	private setBranch(branch: Branch) {
		this._currentBranch = branch;
		this._branch$.next(branch);
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
		return (
			this._currentBranch !== null && this._currentBranch !== undefined
		);
	}

	public getBranchId(): string {
		return this._currentBranch?.id ?? null;
	}

	public setCurrentBranch(branch: Branch) {
		this.setBranch(branch);
		this._currentBranch = branch;
		this._storageService.store("bl-branch", branch.id);
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
