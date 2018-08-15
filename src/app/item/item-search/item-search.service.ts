import {Injectable} from '@angular/core';
import {ItemService} from '@wizardcoder/bl-connect';
import {BlApiError, Item} from '@wizardcoder/bl-model';
import {Subject, Observable} from 'rxjs';
import {StorageService} from '../../storage/storage.service';
import {CartService} from '../../cart/cart.service';

@Injectable()
export class ItemSearchService {
	private _searchResultError$: Subject<any>;
	private _searchResult$: Subject<boolean>;
	private _searchTerm: string;
	private _searchResult: Item[];
	private _storageSearchTermName: string;

	constructor(private _itemService: ItemService,
	            private _cartService: CartService,
	            private _storageService: StorageService) {
		this._searchResultError$ = new Subject<any>();
		this._searchResult$ = new Subject<boolean>();
		this._storageSearchTermName = 'bl-item-search-term';
/*
		if (this._storageService.get(this._storageSearchTermName)) {
			this.search(this._storageService.get(this._storageSearchTermName));
		}
		*/
	}

	public async search(searchTerm: string, addToCart?: boolean): Promise<Item[]> {
		if (!searchTerm || searchTerm.length < 3) {
			return;
		}

		this.setSearchTerm(searchTerm);

		let items: Item[] = [];

		try {
			items = await this._itemService.get('?s=' + this._searchTerm);
		} catch (e) {
			try {
				items = await this._itemService.get('?info.isbn=' + this._searchTerm);
			} catch (e) {
				items = [];
			}
		}

		if (items.length === 1 && addToCart) {
			if (!this._cartService.contains(items[0].id)) {
				this._cartService.add(items[0]);
			}
		}

		this.setSearchResult(items);

		return items;
	}

	public getSearchTerm(): string {
		return this._searchTerm;
	}

	public getSearchResult(): Item[] {
		return this._searchResult;
	}

	public onSearchResult(): Observable<boolean> {
		return this._searchResult$;
	}

	public onSearchResultError(): Observable<Item[]> {
		return this._searchResultError$;
	}

	private setSearchResult(searchResult: Item[]) {
		this._searchResult = searchResult;

		if (searchResult.length > 0) {
			this._searchResult$.next(true);
		} else {
			this._searchResultError$.next(true);
		}
	}

	private setSearchTerm(searchTerm: string) {
		this._searchTerm = searchTerm;
		//this._storageService.store(this._storageSearchTermName, this._searchTerm);
	}
}
