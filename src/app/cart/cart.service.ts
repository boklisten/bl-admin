import { Injectable } from "@angular/core";
import { UserDetail } from "@boklisten/bl-model";
import { Subject, Observable, ReplaySubject, Subscription } from "rxjs";
import { CustomerService } from "../customer/customer.service";
import { BranchStoreService } from "../branch/branch-store.service";
import { CartItem } from "./cart-item/cart-item";
import { PriceService } from "../price/price.service";
import { PriceInformation } from "../price/price-information";

@Injectable()
export class CartService {
	private _notificationSettings: { email: boolean };
	private _cart$: ReplaySubject<CartItem[]>;
	private _cartItems$: { cartItem: CartItem; subscription: Subscription }[];
	private _cartConfirm$: Subject<boolean>;
	private _customerDetailId: string;
	private _locked: boolean;

	constructor(
		private _customerService: CustomerService,
		private _branchStoreService: BranchStoreService,
		private _priceService: PriceService
	) {
		this._cartConfirm$ = new Subject<boolean>();
		this._cart$ = new ReplaySubject(1);
		this._cartItems$ = [];
		this._notificationSettings = { email: true };

		this.handleCustomerChange();
		this.handleCustomerClearChange();
		this.handleBranchChange();
	}

	public subscribe(func: (cart: CartItem[]) => void): Subscription {
		return this._cart$.asObservable().subscribe(func);
	}

	public add(cartItem: CartItem): boolean {
		if (cartItem.getValidActions().length <= 0) {
			return;
		}

		if (!this.contains(cartItem)) {
			this.addCartItem(cartItem);
		} else {
			throw new Error("cart already contains cart item");
		}

		this.notifyCartChange(this.getCart());
		return true;
	}

	public remove(cartItem: CartItem): void {
		for (let i = 0; i < this._cartItems$.length; i++) {
			if (this.isCartItemEqual(this._cartItems$[i].cartItem, cartItem)) {
				this._cartItems$[i].subscription.unsubscribe();
				this._cartItems$.splice(i, 1);
				this.notifyCartChange(this.getCart());
				return;
			}
		}
	}

	public setLock() {
		this._locked = true;
	}

	public clearLock() {
		this._locked = false;
	}

	public isLocked() {
		return this._locked;
	}

	public contains(cartItem: CartItem): boolean {
		for (const ci of this.getCart()) {
			if (this.isCartItemEqual(ci, cartItem)) {
				return true;
			}
		}
		return false;
	}

	public clear(): void {
		this._cartItems$ = [];
		this.notifyCartChange(this.getCart());
	}

	public setNotificationSettings(notfications: { email: boolean }): void {
		this._notificationSettings = notfications;
	}

	public getNotificationSettings(): { email: boolean } {
		return this._notificationSettings;
	}

	public async getPriceInformation(): Promise<PriceInformation> {
		let totalPriceInformation = this._priceService.getEmptyPriceInformation();

		for (const cartItem of this.getCart()) {
			const cartItemPriceInformation = await cartItem.getPriceInformation();

			totalPriceInformation = this._priceService.addPriceInformation(
				totalPriceInformation,
				cartItemPriceInformation
			);
		}

		return totalPriceInformation;
	}

	public confirmCart(): void {
		this.clear();
		this._customerService.reload();
		this._cartConfirm$.next(true);
	}

	public onCartConfirm(): Observable<boolean> {
		return this._cartConfirm$;
	}

	public getCart(): CartItem[] {
		return this._cartItems$.map(cartItemSub => {
			return cartItemSub.cartItem;
		});
	}

	private isCartItemEqual(a: CartItem, b: CartItem): boolean {
		if (
			(a.getBLID() || b.getBLID()) &&
			!(a.getMovedFromOrderId() || b.getMovedFromOrderId())
		) {
			return a.getBLID() === b.getBLID();
		}
		return a === b || a.getItemId() === b.getItemId();
	}

	private addCartItem(cartItem: CartItem) {
		this._cartItems$.push({
			cartItem: cartItem,
			subscription: cartItem.subscribe(() => {
				this.notifyCartChange(this.getCart());
			})
		});
	}

	private notifyCartChange(cart: CartItem[]) {
		this._cart$.next(cart);
	}

	private handleBranchChange() {
		this._branchStoreService.onBranchChange().subscribe(() => {
			this.clear();
		});
	}

	private handleCustomerChange() {
		this._customerService.subscribe((customerDetail: UserDetail) => {
			if (customerDetail.id !== this._customerDetailId) {
				this._customerDetailId = customerDetail.id;
				this.clear();
			}
		});
	}

	private handleCustomerClearChange() {
		this._customerService.onClear(clear => {
			if (clear) {
				this.clear();
			}
		});
	}
}
