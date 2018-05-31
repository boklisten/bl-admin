import {Injectable} from '@angular/core';
import {BranchStoreService} from '../branch-store.service';
import {BranchItemService} from '@wizardcoder/bl-connect';
import {Branch, BranchItem} from '@wizardcoder/bl-model';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BranchItemStoreService {
	private _branch: Branch;
	private _branchItems: BranchItem[];
	private _branchItemChange$: Subject<boolean>;

	constructor(private _branchStoreService: BranchStoreService, private _branchItemService: BranchItemService) {
		this.onBranchUpdate();
		this._branchItems = [];
		this._branchItemChange$ = new Subject();
	}

	public getBranchItems(): BranchItem[] {
		return this._branchItems;
	}

	public onBranchItemsChange(): Observable<boolean> {
		return this._branchItemChange$;
	}

	private onBranchUpdate() {
		if (this._branchStoreService.getCurrentBranch()) {
			this._branch = this._branchStoreService.getCurrentBranch();
			this.fetchBranchItems();
		}

		this._branchStoreService.onBranchChange().subscribe(() => {
			this._branch = this._branchStoreService.getCurrentBranch();
			this.fetchBranchItems();
		});
	}

	private fetchBranchItems() {
		this._branchItemService.getManyByIds(this._branch.branchItems).then((branchItems: BranchItem[]) => {
			this._branchItems = branchItems;
			this._branchItemChange$.next(true);
		}).catch((getBranchItemsError) => {
			console.log('BranchItemStoreService: could not get branchItems');
		});
	}
}
