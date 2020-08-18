import { Injectable } from "@angular/core";
import { BranchStoreService } from "../branch-store.service";
import { BranchItemService } from "@wizardcoder/bl-connect";
import { BranchItem } from "@wizardcoder/bl-model";
import { Subject, ReplaySubject, Subscription } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class BranchItemStoreService {
	private _branchItems: BranchItem[];
	private _branchItems$: ReplaySubject<BranchItem[]>;
	private _wait$: Subject<boolean>;

	constructor(
		private _branchStoreService: BranchStoreService,
		private _branchItemService: BranchItemService
	) {
		this._branchItems$ = new ReplaySubject(1);
		this._wait$ = new Subject();

		this._branchItems = [];
		this.handleBranchChange();
	}

	public subscribe(func: (branchItems: BranchItem[]) => void): Subscription {
		return this._branchItems$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	public getBranchItems(): BranchItem[] {
		return this._branchItems;
	}

	public isItemInBranchItems(itemId: string): boolean {
		for (let branchItem of this._branchItems) {
			if ((branchItem.item as string) === itemId) {
				return true;
			}
		}
		return false;
	}

	private handleBranchChange() {
		this._branchStoreService.subscribe(branch => {
			this._wait$.next(true);
			this.fetchBranchItems(branch.branchItems as string[])
				.then(branchItems => {
					this.setBranchItems(branchItems);
				})
				.catch(() => {
					this.setBranchItems([]);
				});
		});
	}

	private setBranchItems(branchItems: BranchItem[]) {
		this._branchItems = branchItems;
		this._branchItems$.next(this._branchItems);
		this._wait$.next(false);
	}

	private async fetchBranchItems(
		branchItemIds: string[]
	): Promise<BranchItem[]> {
		let branchItems = [];
		try {
			branchItems = await this._branchItemService.getManyByIds(
				branchItemIds
			);
		} catch (e) {
			branchItems = [];
		}
		return branchItems;
	}
}
