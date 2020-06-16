import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	OnDestroy
} from "@angular/core";
import { CartService } from "../cart.service";
import { Item, OrderItem } from "@wizardcoder/bl-model";
import { ItemService } from "@wizardcoder/bl-connect";
import { CartItem } from "../cart-item/cart-item";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalWindow } from "@ng-bootstrap/ng-bootstrap/modal/modal-window";
import { CartItemSearchService } from "../cart-item-search/cart-item-search.service";
import { DateService } from "../../date/date.service";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";
import { CartOrderService } from "../cart-order/cart-order.service";
import { PriceInformation } from "../../price/price-information";

@Component({
	selector: "app-cart-list",
	templateUrl: "./cart-list.component.html",
	styleUrls: ["./cart-list.component.scss"]
})
export class CartListComponent implements OnInit, OnDestroy {
	@Output() cartConfirmed: EventEmitter<boolean>;
	@Output() cartConfirmationFailed: EventEmitter<boolean>;

	public cart: CartItem[];
	public partlyPaymentTotals: { date: Date; total: number }[];
	private _cartConfirmModal: NgbModalRef;
	public searching: boolean;
	public notfifyByEmail: boolean;
	public showNotifyByEmailEdit: boolean;
	private cart$: Subscription;
	public totalPriceInformation: PriceInformation;

	constructor(
		private _cartService: CartService,
		private _modalService: NgbModal,
		private _authService: AuthService,
		private _cartOrderService: CartOrderService
	) {
		this.cart = [];
		this.cartConfirmed = new EventEmitter<boolean>();
		this.cartConfirmationFailed = new EventEmitter<boolean>();
		this.notfifyByEmail = true;
		this.showNotifyByEmailEdit = this._authService.isAdmin();
		this.getTotalPriceInformation();
	}

	ngOnInit() {
		this.handleCartChange();
	}

	ngOnDestroy() {
		this.cart$.unsubscribe();
	}

	private handleCartChange() {
		this.cart$ = this._cartService.subscribe(cart => {
			this.cart = cart;
			this.getTotalPriceInformation();
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

	public async getTotalPriceInformation(): Promise<void> {
		this.totalPriceInformation = await this._cartService.getPriceInformation();
	}

	onShowConfirm(content) {
		//this._cartOrderService.createOrder();

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
