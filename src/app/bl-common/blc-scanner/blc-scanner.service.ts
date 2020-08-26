import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Subject, Subscription } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class BlcScannerService {
	private _isbn$: Subject<number>;
	private _blid$: Subject<string>;

	constructor() {
		this._isbn$ = new Subject<number>();
		this._blid$ = new Subject<string>();
	}

	public onIsbn(func: (isbn: number) => void): Subscription {
		return this._isbn$.subscribe(func);
	}

	public onBlid(func: (blid: string) => void): Subscription {
		return this._blid$.subscribe(func);
	}

	public scanBlid(scannedString: string) {
		if (this.isNumeric(scannedString)) {
			return;
		}

		const blid = scannedString;

		if (blid.length === 12) {
			this._blid$.next(blid);
		}
	}

	public scanIsbn(scannedString: string) {
		if (!this.isNumeric(scannedString)) {
			return;
		}

		if (scannedString.length < 10 || scannedString.length > 13) {
			return;
		}

		const isbn = parseInt(scannedString, 10);
		this._isbn$.next(isbn);
	}

	private isNumeric(value) {
		return /^-?\d+$/.test(value);
	}
}
