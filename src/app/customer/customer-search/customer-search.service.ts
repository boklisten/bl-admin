import {Injectable} from '@angular/core';
import {UserDetailService} from '@wizardcoder/bl-connect';
import {Subject} from 'rxjs/Subject';
import {UserDetail} from '@wizardcoder/bl-model';
import {Observable} from 'rxjs/Observable';
import {StorageService} from '../../storage/storage.service';

@Injectable()
export class CustomerSearchService {
	private _searchResult$: Subject<UserDetail[]>;
	private _currentSearchTerm: string;
	private _searchTermStorageName: string;

	constructor(private _userDetailService: UserDetailService, private _storageService: StorageService) {
		this._searchTermStorageName = 'bl-customer-search-term';
		this._searchResult$ = new Subject<UserDetail[]>();

		if (this._storageService.get(this._searchTermStorageName)) {
			this._currentSearchTerm = this._storageService.get(this._searchTermStorageName);
		}
	}

	public search(searchTerm: string) {
		this.setSearchTerm(searchTerm);

		this._userDetailService.get('?s=' + searchTerm).then((userDetails: UserDetail[]) => {
			this._searchResult$.next(userDetails);
		}).catch(() => {
			console.log('userDetailService: there was an error when getting userdetails');
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

}
