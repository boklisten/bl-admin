import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Subject, Subscription } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class BlcScannerService {
	private _isbn$: Subject<string>;
	private _blid$: Subject<string>;

	constructor() {
		this._isbn$ = new Subject<string>();
		this._blid$ = new Subject<string>();
	}

	public onIsbn(): Observable<string> {
		return this._isbn$.asObservable();
	}

	public onBlid(func: (blid: string) => void): Subscription {
		return this._blid$.subscribe(func);
	}

	public scanBlid(scannedString: string) {
		const blid = scannedString;

		if (blid.length === 12) {
			this._blid$.next(blid);
		}
	}

	public scanIsbn(scannedString: string) {
		const reversedSearchString = scannedString.split("").reverse();
		let isbn = "";
		const isbnMaxLength = 12;
		let isbnLength = 0;
		for (const num of reversedSearchString) {
			if (parseInt(num, 10) || num === "0") {
				if (isbnLength <= isbnMaxLength) {
					isbn += num;

					if (isbnLength === isbnMaxLength) {
						const isbnSearchString = isbn
							.split("")
							.reverse()
							.join("");
						this._isbn$.next(isbnSearchString);
					}

					isbnLength++;
				}
			}
		}
	}
}
