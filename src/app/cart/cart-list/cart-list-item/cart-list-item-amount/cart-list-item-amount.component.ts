import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { CartItem } from "../../../cart-item/cart-item";
import { PriceInformation } from "../../../../price/price-information";
import { Subscription } from "rxjs";

@Component({
	selector: "app-cart-list-item-amount",
	templateUrl: "./cart-list-item-amount.component.html",
	styleUrls: ["./cart-list-item-amount.component.scss"]
})
export class CartListItemAmountComponent implements OnInit, OnDestroy {
	@Input() cartItem: CartItem;
	public priceInformation: PriceInformation;
	public wait: boolean;
	private _cartItemChange$: Subscription;

	constructor() {}

	ngOnInit() {
		this.getPriceInformation();
		this.handleCartItemChange();
	}

	ngOnDestroy() {
		this._cartItemChange$.unsubscribe();
	}

	private handleCartItemChange() {
		this._cartItemChange$ = this.cartItem.subscribe(change => {
			if (change) {
				this.wait = true;
				this.getPriceInformation();
			}
		});
	}

	private getPriceInformation() {
		this.cartItem
			.getPriceInformation()
			.then(priceInformation => {
				this.priceInformation = priceInformation;
				this.wait = false;
			})
			.catch(() => {
				this.wait = false;
			});
	}
}
