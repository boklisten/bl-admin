import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CartService } from "../../cart/cart.service";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";
import { Item, UniqueItem } from "@boklisten/bl-model";
import { CartItem } from "../../cart/cart-item/cart-item";

@Component({
	selector: "app-unique-item-register-from-cart",
	templateUrl: "./unique-item-register-from-cart.component.html",
	styleUrls: ["./unique-item-register-from-cart.component.scss"],
})
export class UniqueItemRegisterFromCartComponent implements OnInit {
	@Output() registered: EventEmitter<boolean>;

	public itemId: string;
	public title: string;
	public isbn: number;
	public blid: string;
	private currentCartItemIndex: number;
	private cartItems: CartItem[];

	constructor(
		private _cartService: CartService,
		private _blcScannerService: BlcScannerService
	) {
		this.registered = new EventEmitter();
	}

	ngOnInit() {
		this.cartItems = this.getCartItemsThatShouldHaveBlid();

		if (this.cartItems.length === 0) {
			this.done();
			return;
		}
		this.currentCartItemIndex = 0;
		this.setCurrentCartItem(0);
	}

	private getCartItemsThatShouldHaveBlid(): CartItem[] {
		let cartItems = [];
		for (let cartItem of this._cartService.getCart()) {
			if (!cartItem.getBLID() && !cartItem.isDigital()) {
				if (
					["partly-payment", "rent", "loan", "sell"].indexOf(
						cartItem.getAction().action.toString()
					) >= 0
				) {
					cartItems.push(cartItem);
				}
			}
		}
		return cartItems;
	}

	private setCurrentCartItem(index: number) {
		this.itemId = this.cartItems[index].getItemId();
		this.title = this.cartItems[index].getTitle();
		this.isbn = this.cartItems[index].getISBN();
		this.blid = this.cartItems[index].getBLID();
	}

	public onUniqueItemRegistered(uniqueItem: UniqueItem) {
		this.cartItems[this.currentCartItemIndex].setBLID(uniqueItem.blid);
		this.nextCartItem();
	}

	private nextCartItem() {
		this.currentCartItemIndex += 1;

		if (this.currentCartItemIndex == this.cartItems.length) {
			this.done();
		} else {
			this.setCurrentCartItem(this.currentCartItemIndex);
		}
	}

	public onSkip() {
		this.nextCartItem();
	}

	private done() {
		this.registered.emit(true);
	}
}
