import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {Subject} from 'rxjs/internal/Subject';

@Injectable({
	providedIn: 'root'
})
export class BlcScannerService {
	private _isbn$: Subject<string>;

	constructor() {
		this._isbn$ = new Subject<string>();
	}

	public onIsbn(): Observable<string> {
		return this._isbn$.asObservable();
	}

	public scanIsbn(scannedString: string) {
		const reversedSearchString = scannedString.split('').reverse();
		let isbn = '';
		const isbnMaxLength = 12;
		let isbnLength = 0;
		for (const num of reversedSearchString) {
			if (parseInt(num, 10) || num === '0') {
				if (isbnLength <= isbnMaxLength) {
					isbn += num;

					if (isbnLength === isbnMaxLength) {
						this._isbn$.next(isbn.split('').reverse().join(''));
					}

					isbnLength++;
				}
			}
		}
	}


}
