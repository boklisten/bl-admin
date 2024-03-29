import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { StorageService } from "../../storage/storage.service";
import { BranchService } from "@boklisten/bl-connect";

@Injectable({
	providedIn: "root",
})
export class BlcScannerService {
	constructor(
		private _branchService: BranchService,
		private _storageService: StorageService
	) {
		this._isbn$ = new Subject<number>();
		this._blid$ = new Subject<string>();
	}
	private _isbn$: Subject<number>;
	private _blid$: Subject<string>;

	public isUllernBlid(value: string) {
		return value.length === 8 && this.isNumeric(value);
	}

	public onIsbn(func: (isbn: number) => void): Subscription {
		return this._isbn$.subscribe(func);
	}

	public onBlid(func: (blid: string) => void): Subscription {
		return this._blid$.subscribe(func);
	}

	public scanBlid(scannedString: string) {
		if (this.isNumeric(scannedString) && scannedString.length !== 8) {
			return;
		}
		let blid = scannedString;
		if (
			scannedString.length === 12 &&
			this.isNumeric(scannedString.slice(4))
		) {
			blid = scannedString.slice(4);
		}

		if (blid.length === 12 || this.isUllernBlid(blid)) {
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
