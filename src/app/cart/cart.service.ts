import { Injectable } from "@angular/core";
import { UserDetail } from "@wizardcoder/bl-model";
import { DateService } from "../date/date.service";
import { Subject, Observable, ReplaySubject, Subscription } from "rxjs";
import { CustomerService } from "../customer/customer.service";
import { BranchStoreService } from "../branch/branch-store.service";
import { CartItem } from "./cart-item/cart-item";

@Injectable()
export class CartService {
	private _cart: CartItem[];
	private _notificationSettings: { email: boolean };
	private _cart$: ReplaySubject<CartItem[]>;

	private _cartChange$: Subject<boolean>;
	private _cartConfirm$: Subject<boolean>;
	private _customerDetailId: string;

	constructor(
		private _dateService: DateService,
		private _customerService: CustomerService,
		private _branchStoreService: BranchStoreService
	) {
		this._cart = [];
		this._cartChange$ = new Subject<boolean>();
		this._cartConfirm$ = new Subject<boolean>();
		this._cart$ = new ReplaySubject(1);
		this._notificationSettings = { email: true };
		this.handleCustomerChange();
		this.handleCustomerClearChange();

		this._branchStoreService.onBranchChange().subscribe(() => {
			this.clear();
		});
	}

	public subscribe(func: (cart: CartItem[]) => void): Subscription {
		return this._cart$.asObservable().subscribe(func);
	}

	public add(cartItem: CartItem): boolean {
		if (!this.contains(cartItem)) {
			this._cart.push(cartItem);
		} else {
			throw new Error("cart already contains cart item");
		}

		this.notifyCartChange(this._cart);
		return true;
	}

	public contains(cartItem: CartItem): boolean {
		for (const ci of this._cart) {
			if (ci === cartItem || ci.getItemId() === cartItem.getItemId()) {
				return true;
			}
		}
		return false;
	}

	public remove(cartItem: CartItem) {
		for (let i = 0; i < this._cart.length; i++) {
			if (
				this._cart[i] === cartItem ||
				this._cart[i].getItemId() === cartItem.getItemId()
			) {
				this._cart.splice(i, 1);
				this._cartChange$.next(true);
				this.notifyCartChange(this._cart);
				return;
			}
		}
	}

	public clear() {
		this._cart = [];
		this._cartChange$.next(true);
		this.notifyCartChange(this._cart);
	}

	private notifyCartChange(cart: CartItem[]) {
		this._cart$.next(cart);
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

	public setNotificationSettings(notfications: { email: boolean }) {
		this._notificationSettings = notfications;
	}

	public getNotificationSettings(): { email: boolean } {
		return this._notificationSettings;
	}

	/*
	public getCartItemsApartOfNewOrder(): CartItem[] {
		const cartItems: CartItem[] = [];

		for (const cartItem of this._cart) {
			if (
				!(
					cartItem.orderItem.amount === 0 &&
					cartItem.originalOrderItem &&
					cartItem.originalOrderItem.amount !==
						cartItem.orderItem.amount
				)
			) {
				cartItems.push(cartItem);
			}
		}

		return cartItems;
	}

	public getCartItemsNotApartOfNewOrder(): CartItem[] {
		const cartItems: CartItem[] = [];

		for (const cartItem of this._cart) {
			if (cartItem.orderItem.amount === 0 && cartItem.originalOrderItem) {
				cartItems.push(cartItem);
			}
		}

		return cartItems;
	}

*/

	public cartIncludesPartlyPayments(): boolean {
		for (let cartItem of this._cart) {
			if (cartItem.orderItem.type === "partly-payment") {
				return true;
			}
		}
		return false;
	}
	public confirmCart() {
		this.clear();
		this._customerService.reload();
		this._cartConfirm$.next(true);
	}

	public onCartConfirm(): Observable<boolean> {
		return this._cartConfirm$;
	}

	public onCartChange() {
		return this._cartChange$;
	}

	public getCart(): CartItem[] {
		return this._cart;
	}

	public getTotalAmount(): number {
		let totalAmount = 0;

		this._cart.forEach((cartItem: CartItem) => {
			totalAmount += cartItem.orderItem.amount;
		});

		return totalAmount;
	}

	public getTotalAmountWithPartlyPayments() {
		let total = 0;

		this._cart.forEach(cartItem => {
			total += cartItem.orderItem.amount;

			if (cartItem.orderItem.type === "partly-payment") {
				total += cartItem.orderItem.info["amountLeftToPay"];
			}
		});

		return total;
	}

	public getPartlyPaymentTotals(): { date: Date; total: number }[] {
		let periods = [];
		let periodTotals = {};

		this._cart.forEach(cartItem => {
			if (cartItem.orderItem.type === "partly-payment") {
				if (periods.indexOf(cartItem.orderItem.info.periodType) >= 0) {
					periodTotals[cartItem.orderItem.info.periodType] =
						periodTotals[cartItem.orderItem.info.periodType] +
						cartItem.orderItem.info["amountLeftToPay"];
				} else {
					periods.push(cartItem.orderItem.info.periodType);
					periodTotals[cartItem.orderItem.info.periodType] =
						cartItem.orderItem.info["amountLeftToPay"];
				}
			}
		});

		let partlyPaymentTotals = [];

		periods.forEach(period => {
			partlyPaymentTotals.push({
				date: this._dateService.getPartlyPaymentPeriodDate(period),
				total: periodTotals[period]
			});
		});

		return partlyPaymentTotals;
	}
}
