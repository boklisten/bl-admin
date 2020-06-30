import { Injectable } from "@angular/core";
import { ItemService } from "@wizardcoder/bl-connect";
import { Item } from "@wizardcoder/bl-model";
import { Subject, Subscription, ReplaySubject } from "rxjs";
import { BlcSortService } from "../../bl-common/blc-sort/blc-sort.service";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";

@Injectable()
export class ItemSearchService {
	private _result$: ReplaySubject<Item[]>;
	private _wait$: Subject<boolean>;

	constructor(
		private _itemService: ItemService,
		private _blcSortService: BlcSortService,
		private _blcScannerService: BlcScannerService
	) {
		this._result$ = new ReplaySubject(1);
		this._wait$ = new Subject();
		this.handleIsbnScanChange();
	}

	public subscribe(func: (items: Item[]) => void): Subscription {
		return this._result$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	public searchISBN(isbn: number) {
		if (!this.isSearchTermValid(isbn.toString())) {
			return;
		}

		this.searchByIsbn(isbn)
			.then(items => {
				this.setSearchResult(items);
			})
			.catch(() => {
				this.setSearchResult([]);
			});
	}

	public async search(searchTerm: string | number): Promise<Item[]> {
		if (!this.isSearchTermValid(searchTerm.toString())) {
			return;
		}

		this._wait$.next(true);

		let items = [];

		try {
			items = await this.searchForItems(searchTerm.toString());
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

	private handleIsbnScanChange() {
		this._blcScannerService.onIsbn(isbn => {
			this.searchISBN(isbn);
		});
	}

	private async searchForItems(term: string): Promise<Item[]> {
		let items = [];

		try {
			items = await this.searchByTerm(term);
		} catch (e) {
			try {
				console.log("trying isbn");
				items = await this.searchByIsbn(parseInt(term, 10));
			} catch (e) {
				items = [];
			}
		}
		return items;
	}

	private async searchByIsbn(isbn: number): Promise<Item[]> {
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
