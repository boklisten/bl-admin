import { Injectable } from "@angular/core";
import {
	BlApiError,
	CustomerItem,
	Item,
	Order,
	OrderItem,
	Period
} from "@wizardcoder/bl-model";
import { ItemPriceService } from "../price/item-price/item-price.service";
import { OrderItemInfo } from "@wizardcoder/bl-model/dist/order/order-item/order-item-info";
import { OrderItemType } from "@wizardcoder/bl-model/dist/order/order-item/order-item-type";
import { DateService } from "../date/date.service";
import { Subject, Observable } from "rxjs";
import { CartItem } from "./cartItem";
import { ItemService } from "@wizardcoder/bl-connect";
import { CartItemAction } from "./cartItemAction";
import { CustomerOrderService } from "../order/customer-order/customer-order.service";
import { CustomerDetailService } from "../customer/customer-detail/customer-detail.service";
import { CustomerService } from "../customer/customer.service";
import { BranchStoreService } from "../branch/branch-store.service";
import { CartHelperService } from "./cart-helper.service";
import { CartItemSearchService } from "./cart-item-search/cart-item-search.service";
import { BranchItemHelperService } from "../branch/branch-item-helper/branch-item-helper.service";

@Injectable()
export class CartService {
	private _cart: CartItem[];
	private _notificationSettings: { email: boolean };

	private _cartChange$: Subject<boolean>;
	private _cartConfirm$: Subject<boolean>;
	private _customerDetailId: string;

	constructor(
		private _itemPriceService: ItemPriceService,
		private _dateService: DateService,
		private _itemService: ItemService,
		private _customerService: CustomerService,
		private _branchStoreService: BranchStoreService,
		private _cartHelperService: CartHelperService,
		private _branchItemHelperService: BranchItemHelperService,
		private _customerDetailService: CustomerDetailService
	) {
		this._cart = [];
		this._cartChange$ = new Subject<boolean>();
		this._cartConfirm$ = new Subject<boolean>();
		this._notificationSettings = { email: true };

		if (this._customerDetailService.getCustomerDetail()) {
			this._customerDetailId = this._customerDetailService.getCustomerDetail().id;
		}

		this.onCustomerDetailChange();

		this._branchStoreService.onBranchChange().subscribe(() => {
			this.clear();
		});
	}

	public setNotificationSettings(notfications: { email: boolean }) {
		this._notificationSettings = notfications;
	}

	public getNotificationSettings(): { email: boolean } {
		return this._notificationSettings;
	}

	public add(item: Item) {
		try {
			const orderAndOrderItem: {
				orderItem: OrderItem;
				order: Order;
			} = this._customerService.getOrderedItem(item.id);
			this.addOrderItem(
				orderAndOrderItem.orderItem,
				orderAndOrderItem.order
			);
		} catch (e) {
			this.addNewItem(item);
		}
	}

	public addOrderItem(orderItem: OrderItem, order: Order, item?: Item) {
		if (this.contains(orderItem.item as string)) {
			return;
		}
		//416
		if (!item) {
			this._itemService
				.getById(orderItem.item as string)
				.then((foundItem: Item) => {
					this.addNewOrderItem(orderItem, order, foundItem);
				});
		} else {
			this.addNewOrderItem(orderItem, order, item);
		}
	}

	public addCustomerItem(customerItem: CustomerItem, item?: Item) {
		if (this.contains(customerItem.item as string)) {
			return;
		}

		if (!item) {
			this._itemService
				.getById(customerItem.item as string)
				.then((foundItem: Item) => {
					this.addNewCustomerItem(customerItem, foundItem);
				})
				.catch((getItemError: BlApiError) => {
					console.log(
						"cartService: Could not find item when trying to add customerItem",
						getItemError
					);
					return;
				});
		} else {
			this.addNewCustomerItem(customerItem, item)
				.then(() => {})
				.catch(err => {
					console.log("could not add new customerItem: " + err);
				});
		}
	}

	public remove(itemId: string) {
		for (let i = 0; i < this._cart.length; i++) {
			if (this._cart[i].item.id === itemId) {
				this._cart.splice(i, 1);
				this._cartChange$.next(true);
				return;
			}
		}
	}

	public contains(itemId: string) {
		for (const orderItem of this._cart) {
			if (orderItem.item.id === itemId) {
				return true;
			}
		}

		return false;
	}

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

	public cartIncludesPartlyPayments(): boolean {
		for (let cartItem of this._cart) {
			if (cartItem.orderItem.type === "partly-payment") {
				return true;
			}
		}
		return false;
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

	public clear() {
		this._cart = [];
		this._cartChange$.next(true);
	}

	public confirmCart() {
		this.clear();
		this._customerService.reloadCustomer();
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

	private onCustomerDetailChange() {
		this._customerDetailService.onCustomerDetailChange().subscribe(() => {
			if (this._customerService.haveCustomer()) {
				if (
					this._customerDetailId &&
					this._customerDetailService.getCustomerDetail().id ===
						this._customerDetailId
				) {
					return;
				} else {
					this._customerDetailId = this._customerDetailService.getCustomerDetail().id;
					this.clear();
				}
			} else {
				this.clear();
			}
		});
	}

	private async addNewCustomerItem(
		customerItem: CustomerItem,
		item: Item
	): Promise<boolean> {
		let orderItem: OrderItem;

		try {
			orderItem = await this._cartHelperService.createOrderItemBasedOnCustomerItem(
				customerItem,
				item
			);
		} catch (e) {
			throw new Error("cartService: could not create orderItem");
		}

		this.addCartItem({
			item: item,
			orderItem: orderItem,
			customerItem: customerItem,
			action: orderItem.type
		});

		return true;
	}

	private addNewItem(item: Item) {
		let orderItem: OrderItem;

		try {
			orderItem = this._cartHelperService.createOrderItemBasedOnItem(
				item
			);
		} catch (e) {
			console.log("the item can not be added", e);
		}

		this.addCartItem({
			item: item,
			orderItem: orderItem,
			action: this._cartHelperService.getFirstValidActionOnItem(item)
				.action
		});
	}

	private addNewOrderItem(orderItem: OrderItem, order: Order, item: Item) {
		const newOrderItem: OrderItem = {
			type: orderItem.type,
			age: "new",
			item: orderItem.item,
			title: orderItem.title,
			amount: 0,
			unitPrice: 0,
			taxRate: orderItem.taxRate,
			taxAmount: 0,
			info: orderItem.info,
			discount: orderItem.discount,
			movedFromOrder: order.id
		};

		this.addCartItem({
			item: item,
			orderItem: newOrderItem,
			action: orderItem.type,
			period: this.getPeriodBasedOnAction(item, orderItem.type),
			originalOrder: order,
			originalOrderItem: orderItem
		});
	}

	private addCartItem(cartItem: CartItem) {
		this._cart.push(cartItem);
		this._cartChange$.next(true);
	}

	private getPeriodBasedOnAction(item: Item, action: CartItemAction): Period {
		try {
			if (action === "rent") {
				return this._branchItemHelperService.getDefaultRentPeriod(item);
			}

			if (action === "partly-payment") {
				return this._branchItemHelperService.getDefaultPartlyPaymentPeriod(
					item
				);
			}
		} catch (e) {
			return null;
		}

		return null;
	}
}
