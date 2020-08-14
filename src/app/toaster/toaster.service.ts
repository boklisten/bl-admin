import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { BlcScannerService } from "../bl-common/blc-scanner/blc-scanner.service";

type ToastType =
	| "SUCCESS"
	| "BLID-SCAN"
	| "ISBN-SCAN"
	| "CART-CONTAINS"
	| "WAIT"
	| "CHECKOUT-CONFIRMED";

@Injectable({
	providedIn: "root"
})
export class ToasterService {
	private toasts$: Subject<any>;

	constructor(private _blcScannerService: BlcScannerService) {
		this.toasts$ = new Subject();
		this.handleBlidScan();
		this.handleIsbnScan();
	}

	public subscribe(func: (toast: any) => void): Subscription {
		return this.toasts$.subscribe(func);
	}

	public add(type: ToastType, content: any, ms?: number) {
		ms = ms ? ms : 5000;
		this.toasts$.next({ type: type, content: content, ms: ms });
	}

	public addWithId(type: ToastType, id: string, content: any, ms?: number) {
		ms = ms ? ms : 5000;
		this.toasts$.next({ type: type, content: content, ms: ms, id: id });
	}

	public removeId(id: string) {
		this.toasts$.next({ id: id });
	}

	private handleBlidScan() {
		this._blcScannerService.onBlid(blid => {
			this.add("BLID-SCAN", { blid: blid });
		});
	}

	private handleIsbnScan() {
		this._blcScannerService.onIsbn(isbn => {
			this.add("ISBN-SCAN", { isbn: isbn });
		});
	}
}
