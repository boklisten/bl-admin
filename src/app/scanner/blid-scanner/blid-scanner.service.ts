import { Injectable } from "@angular/core";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";
import { UniqueItem } from "@wizardcoder/bl-model";
import { UniqueItemService } from "@wizardcoder/bl-connect";
import { Subscription, Subject } from "rxjs";
import { CartService } from "../../cart/cart.service";

@Injectable({
	providedIn: "root"
})
export class BlidScannerService {
	private uniqueItem$: Subject<UniqueItem>;
	private uniqueItemDoesNotExist$: Subject<string>;

	constructor(
		private _blcScannerService: BlcScannerService,
		private _uniqueItemService: UniqueItemService,
		private _cartService: CartService
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
			if (!this._cartService.isLocked()) {
				this._uniqueItemService
					.get({ query: `?blid=${blid}` })
					.then(uniqueItems => {
						this.uniqueItem$.next(uniqueItems[0]);
					})
					.catch(e => {
						this.uniqueItemDoesNotExist$.next(blid);
					});
			}
		});
	}
}
