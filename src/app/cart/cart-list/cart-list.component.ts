import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	OnDestroy
} from "@angular/core";
import { CartService } from "../cart.service";
import { CartItem } from "../cart-item/cart-item";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";
import { PriceInformation } from "../../price/price-information";

@Component({
	selector: "app-cart-list",
	templateUrl: "./cart-list.component.html",
	styleUrls: ["./cart-list.component.scss"]
})
export class CartListComponent implements OnInit, OnDestroy {
	@Output() cartConfirmed: EventEmitter<boolean>;
	public cart: CartItem[];
	public partlyPaymentTotals: { date: Date; total: number }[];
	public searching: boolean;
	public notfifyByEmail: boolean;
	public showNotifyByEmailEdit: boolean;
	public totalPriceInformation: PriceInformation;

	private cart$: Subscription;
	private _cartConfirmModal: NgbModalRef;

	constructor(
		private _cartService: CartService,
		private _modalService: NgbModal,
		private _authService: AuthService
	) {
		this.cart = [];
		this.cartConfirmed = new EventEmitter<boolean>();
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

	public onNotifyByEmailUpdate(notfifyByEmail: boolean) {
		this._cartService.setNotificationSettings({ email: notfifyByEmail });
	}

	public onClearCart() {
		this._cartService.clear();
	}

	public async getTotalPriceInformation(): Promise<void> {
		this.totalPriceInformation = await this._cartService.getPriceInformation();
	}

	public onShowConfirm(content) {
		this._cartConfirmModal = this._modalService.open(content, {
			size: "lg",
			centered: true
			//backdrop: "static"
		});
	}

	public onDismiss() {
		this._cartConfirmModal.close();
	}

	public onCartConfirm() {
		this._cartConfirmModal.close();
		this.cartConfirmed.emit(true);
	}

	private handleCartChange() {
		this.cart$ = this._cartService.subscribe(cart => {
			this.cart = cart;
			this.getTotalPriceInformation();
		});
	}
}
