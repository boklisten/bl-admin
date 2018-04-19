import {Injectable} from '@angular/core';
import {ItemService} from '@wizardcoder/bl-connect';
import {BlApiError, Item} from '@wizardcoder/bl-model';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {StorageService} from '../../storage/storage.service';

@Injectable()
export class ItemSearchService {
	private _searchResultError$: Subject<any>;
	private _searchResult$: Subject<boolean>;
	private _searchTerm: string;
	private _searchResult: Item[];
	private _storageSearchTermName: string;

	constructor(private _itemService: ItemService, private _storageService: StorageService) {
		this._searchResultError$ = new Subject<any>();
		this._searchResult$ = new Subject<boolean>();
		this._storageSearchTermName = 'bl-item-search-term';

		if (this._storageService.get(this._storageSearchTermName)) {
			this.search(this._storageService.get(this._storageSearchTermName));
		}
	}

	public search(searchTerm: string) {
		if (!searchTerm || searchTerm === this._searchTerm || searchTerm.length < 3) {
			return;
		}

		this.setSearchTerm(searchTerm);

		this._itemService.get('?s=' + this._searchTerm).then((items: Item[]) => {
			this.setSearchResult(items);
		}).catch((blApiError: BlApiError) => {
			this._searchResultError$.next(new Error('itemSearchService: could not get items'));
		});
	}

	public getSearchTerm(): string {
		return this._searchTerm;
	}

	private setSearchResult(searchResult: Item[]) {
		this._searchResult = searchResult;
		this._searchResult$.next(true);
	}

	private setSearchTerm(searchTerm: string) {
		this._searchTerm = searchTerm;
		this._storageService.store(this._storageSearchTermName, this._searchTerm);
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
}
