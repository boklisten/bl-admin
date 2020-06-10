import { Injectable } from "@angular/core";
import { UserDetailService } from "@wizardcoder/bl-connect";
import { Subject, Observable, ReplaySubject, Subscription } from "rxjs";
import { BlApiError, UserDetail } from "@wizardcoder/bl-model";
import { StorageService } from "../../storage/storage.service";

@Injectable()
export class CustomerSearchService {
	private _searchResultError$: Subject<any>;
	private _searchResult$: ReplaySubject<UserDetail[]>;
	private _searchTerm$: Subject<string>;
	private _currentSearchTerm: string;
	private _searchTermStorageName: string;
	private _wait$: Subject<boolean>;

	constructor(
		private _userDetailService: UserDetailService,
		private _storageService: StorageService
	) {
		this._searchTermStorageName = "bl-customer-search-term";
		this._searchTerm$ = new Subject();
		this._searchResult$ = new ReplaySubject(1);
		this._searchResultError$ = new Subject();
		this._wait$ = new Subject();

		if (this._storageService.get(this._searchTermStorageName)) {
			this._currentSearchTerm = this._storageService.get(
				this._searchTermStorageName
			);
		}
	}

	public search(searchTerm: string) {
		this._searchTerm$.next(searchTerm);
		if (!searchTerm || searchTerm.length < 3) {
			this._wait$.next(true);
			this.setUserDetails([]);
			return;
		}
		this._wait$.next(true);

		this.fetchUserDetails(searchTerm)
			.then(userDetails => {
				this.setSearchTerm(searchTerm);
				this.setUserDetails(userDetails);
			})
			.catch(() => {
				this.setUserDetails([]);
				this._searchResultError$.next(new Error("not found"));
			});
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	public onSearchTerm(func: (searchTerm: string) => void): Subscription {
		return this._searchTerm$.asObservable().subscribe(func);
	}

	private setUserDetails(userDetails: UserDetail[]) {
		this._searchResult$.next(userDetails);
		this._wait$.next(false);
	}

	private async fetchUserDetails(searchTerm: string): Promise<UserDetail[]> {
		let userDetails = [];
		try {
			userDetails = await this._userDetailService.get({
				query: "?s=" + searchTerm
			});
		} catch (e) {
			return userDetails;
		}
		return userDetails;
	}

	private setSearchTerm(searchTerm: string) {
		this._currentSearchTerm = searchTerm;
		this._storageService.store(
			this._searchTermStorageName,
			this._currentSearchTerm
		);
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
