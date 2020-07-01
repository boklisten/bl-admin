import { Injectable } from "@angular/core";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";
import { UniqueItem } from "@wizardcoder/bl-model";
import { UniqueItemService } from "@wizardcoder/bl-connect";
import { Subscription, Subject } from "rxjs";
import { ToasterService } from "../../toaster/toaster.service";

@Injectable({
	providedIn: "root"
})
export class BlidScannerService {
	private uniqueItem$: Subject<UniqueItem>;
	private uniqueItemDoesNotExist$: Subject<string>;

	constructor(
		private _blcScannerService: BlcScannerService,
		private _uniqueItemService: UniqueItemService,
		private _toasterService: ToasterService
	) {
		this.uniqueItem$ = new Subject();
		this.uniqueItemDoesNotExist$ = new Subject();

		this.handleBlidScanChange();
	}

	public onUniqueItem(func: (uniqueItem: UniqueItem) => void): Subscription {
		return this.uniqueItem$.subscribe(func);
	}

	public onUniqueItemDoesNotExist(
		func: (blidDoesNotExist: string) => void
	): Subscription {
		return this.uniqueItemDoesNotExist$.subscribe(func);
	}

	private handleBlidScanChange() {
		this._blcScannerService.onBlid(blid => {
			this._toasterService.add("BLID-SCAN", { blid: blid }, 2500);
			this._uniqueItemService
				.get({ query: `?blid=${blid}` })
				.then(uniqueItems => {
					this.uniqueItem$.next(uniqueItems[0]);
				})
				.catch(e => {
					this.uniqueItemDoesNotExist$.next(blid);
				});
		});
	}
}
