import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CartService } from "../cart.service";
import { Item, OrderItem } from "@wizardcoder/bl-model";
import { ItemService } from "@wizardcoder/bl-connect";
import { CartItem } from "../cartItem";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalWindow } from "@ng-bootstrap/ng-bootstrap/modal/modal-window";
import { CartItemSearchService } from "../cart-item-search/cart-item-search.service";
import { DateService } from "../../date/date.service";
import { AuthService } from "../../auth/auth.service";

@Component({
	selector: "app-cart-list",
	templateUrl: "./cart-list.component.html",
	styleUrls: ["./cart-list.component.scss"]
})
export class CartListComponent implements OnInit {
	@Output() cartConfirmed: EventEmitter<boolean>;
	@Output() cartConfirmationFailed: EventEmitter<boolean>;

	public cart: CartItem[];
	public partlyPaymentTotals: { date: Date; total: number }[];
	private _cartConfirmModal: NgbModalRef;
	public searching: boolean;
	public notfifyByEmail: boolean;
	public showNotifyByEmailEdit: boolean;

	constructor(
		private _cartService: CartService,
		private _modalService: NgbModal,
		private _cartItemSearchService: CartItemSearchService,
		private _itemService: ItemService,
		private _dateService: DateService,
		private _authService: AuthService
	) {
		this.cart = [];
		this.cartConfirmed = new EventEmitter<boolean>();
		this.cartConfirmationFailed = new EventEmitter<boolean>();
		this.notfifyByEmail = true;
		this.showNotifyByEmailEdit = this._authService.isAdmin();
	}

	ngOnInit() {
		this.cart = this._cartService.getCart();

		this._cartService.onCartChange().subscribe(() => {
			this.cart = this._cartService.getCart();
			//this.partlyPaymentTotals = this._cartService.getPartlyPaymentTotals();
		});

		this._cartItemSearchService
			.onSearching()
			.subscribe((searching: boolean) => {
				this.searching = searching;
			});
	}

	public onCartItemChange() {
		//this.partlyPaymentTotals = this._cartService.getPartlyPaymentTotals();
	}

	public onNotifyByEmailUpdate(notfifyByEmail: boolean) {
		this._cartService.setNotificationSettings({ email: notfifyByEmail });
	}

	public onClearCart() {
		this._cartService.clear();
	}

	remove(orderItem: OrderItem) {
		this._cartService.remove(orderItem.item as string);
	}

	public cartIncludesPartlyPayments(): boolean {
		return this._cartService.cartIncludesPartlyPayments();
	}

	getTotalAmount(): number {
		let totalAmount = 0;

		for (const cartItem of this.cart) {
			totalAmount += cartItem.orderItem.amount;
		}

		return totalAmount;
	}

	getTotalAmountWithPartlyPayments() {
		return this._cartService.getTotalAmountWithPartlyPayments();
	}

	private getPartlyPaymentTotals(): { date: Date; total: number }[] {
		return this._cartService.getPartlyPaymentTotals();
	}

	onShowConfirm(content) {
		this._cartConfirmModal = this._modalService.open(content, {
			size: "lg",
			centered: true
		});
	}

	onCartConfirm() {
		this._cartConfirmModal.close();
		this.cartConfirmed.emit(true);
	}

	onCartFailure() {
		this._cartConfirmModal.close();
		this.cartConfirmationFailed.emit(true);
	}
}
