import { Injectable } from "@angular/core";
import { ItemService } from "@wizardcoder/bl-connect";
import { Item } from "@wizardcoder/bl-model";
import { Subject, Subscription, ReplaySubject } from "rxjs";
import { BlcSortService } from "../../bl-common/blc-sort/blc-sort.service";

@Injectable()
export class ItemSearchService {
	private _result$: ReplaySubject<Item[]>;
	private _wait$: Subject<boolean>;

	constructor(
		private _itemService: ItemService,
		private _blcSortService: BlcSortService
	) {
		this._result$ = new ReplaySubject(1);
		this._wait$ = new Subject();
	}

	public subscribe(func: (items: Item[]) => void): Subscription {
		return this._result$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	public async search(searchTerm: string): Promise<Item[]> {
		if (!this.isSearchTermValid(searchTerm)) {
			return;
		}

		this._wait$.next(true);

		let items = [];

		try {
			items = await this.searchForItems(searchTerm);
		} catch (e) {
			items = [];
		}

		items = this._blcSortService.sortItemsByRelevance(items);
		this.setSearchResult(items);
		return items;
	}

	private isSearchTermValid(searchTerm: string) {
		return searchTerm && searchTerm.length >= 3;
	}

	private async searchForItems(term: string): Promise<Item[]> {
		let items = [];

		try {
			items = await this.searchByTerm(term);
		} catch (e) {
			try {
				items = await this.searchByIsbn(term);
			} catch (e) {
				items = [];
			}
		}
		return items;
	}

	private async searchByIsbn(isbn: string): Promise<Item[]> {
		let items: Item[];

		try {
			items = await this._itemService.get({
				query: "?info.isbn=" + isbn
			});
		} catch (e) {
			items = [];
		}

		return items;
	}

	private async searchByTerm(term: string): Promise<Item[]> {
		let items: Item[];

		try {
			items = await this._itemService.get({
				query: "?s=" + term
			});
		} catch (e) {
			items = [];
		}

		return items;
	}

	private setSearchResult(searchResult: Item[]) {
		this._result$.next(searchResult);
		this._wait$.next(false);
		/*
		this._searchResult = searchResult;

		if (searchResult.length > 0) {
			this._searchResult$.next(true);
		} else {
			this._searchResultError$.next(true);
		}
    */
	}
}
