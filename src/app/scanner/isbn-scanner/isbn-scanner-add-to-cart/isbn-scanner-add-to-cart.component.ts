import { Component, OnInit, OnDestroy } from "@angular/core";
import { BlcScannerService } from "../../../bl-common/blc-scanner/blc-scanner.service";
import { IsbnScannerService } from "../isbn-scanner.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-isbn-scanner-add-to-cart",
	templateUrl: "./isbn-scanner-add-to-cart.component.html",
	styleUrls: ["./isbn-scanner-add-to-cart.component.scss"]
})
export class IsbnScannerAddToCartComponent implements OnInit, OnDestroy {
	private isbnScan$: Subscription;

	constructor(
		private _blcScannerService: BlcScannerService,
		private _isbnScannerService: IsbnScannerService
	) {}

	ngOnInit() {
		this.handleIsbnScanChange();
	}

	ngOnDestroy() {
		this.isbnScan$.unsubscribe();
	}

	private handleIsbnScanChange() {
		this.isbnScan$ = this._blcScannerService.onIsbn(isbn => {
			this._isbnScannerService
				.addCartItemByIsbn(isbn)
				.then(() => {})
				.catch(e => {
					console.log("could not add cart item by isbn", e);
				});
		});
	}
}
