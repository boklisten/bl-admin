import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { BlcScannerService } from "../bl-common/blc-scanner/blc-scanner.service";

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

	public add(type: "BLID-SCAN" | "ISBN-SCAN", content: any, ms: number) {
		this.toasts$.next({ type: type, content: content, ms: ms });
	}

	private handleBlidScan() {
		this._blcScannerService.onBlid(blid => {
			this.add("BLID-SCAN", { blid: blid }, 5000);
		});
	}

	private handleIsbnScan() {
		this._blcScannerService.onIsbn(isbn => {
			this.add("ISBN-SCAN", { isbn: isbn }, 5000);
		});
	}
}
