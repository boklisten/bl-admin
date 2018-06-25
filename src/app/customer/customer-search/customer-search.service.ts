import {Injectable} from '@angular/core';
import {UserDetailService} from '@wizardcoder/bl-connect';
import {Subject, Observable} from 'rxjs';
import {BlApiError, BlApiNotFoundError, UserDetail} from '@wizardcoder/bl-model';
import {StorageService} from '../../storage/storage.service';

@Injectable()
export class CustomerSearchService {
	private _searchResultError$: Subject<any>;
	private _searchResult$: Subject<UserDetail[]>;
	private _currentSearchTerm: string;
	private _searchTermStorageName: string;

	constructor(private _userDetailService: UserDetailService, private _storageService: StorageService) {
		this._searchTermStorageName = 'bl-customer-search-term';
		this._searchResult$ = new Subject<UserDetail[]>();
		this._searchResultError$ = new Subject<any>();

		if (this._storageService.get(this._searchTermStorageName)) {
			this._currentSearchTerm = this._storageService.get(this._searchTermStorageName);
		}
	}

	public search(searchTerm: string) {
		if (searchTerm && searchTerm.length < 3) {
			return;
		}
		this.setSearchTerm(searchTerm);

		this._userDetailService.get('?s=' + searchTerm).then((userDetails: UserDetail[]) => {
			this._searchResult$.next(userDetails);
		}).catch((blApiError: BlApiError) => {
			console.log('userDetailService: there was an error when getting customer details', blApiError);
			this._searchResultError$.next(new Error('not found'));
		});
	}

	public setSearchTerm(searchTerm: string) {
		this._currentSearchTerm = searchTerm;
		this._storageService.store(this._searchTermStorageName, this._currentSearchTerm);
	}

	public getSearchTerm(): string {
		return this._currentSearchTerm;
	}

	public onSearchResult(): Observable<UserDetail[]> {
		return this._searchResult$;
	}

	public onSearchResultError(): Observable<any> {
		return this._searchResultError$;
	}

}
