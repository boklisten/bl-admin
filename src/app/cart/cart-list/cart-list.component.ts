import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	OnDestroy,
	ViewChild
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
	@ViewChild("registerUniqueItemModal") registerUniqueItemModalContent;
	@ViewChild("checkoutModal") checkoutModalContent;

	public cart: CartItem[];
	public partlyPaymentTotals: { date: Date; total: number }[];
	public searching: boolean;
	public notfifyByEmail: boolean;
	public showNotifyByEmailEdit: boolean;
	public totalPriceInformation: PriceInformation;

	private cart$: Subscription;
	private cartCheckoutModal: NgbModalRef;
	private registerUniqueItemModal: NgbModalRef;

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

	public onConfirm() {
		this._cartService.startCheckoutProcess();

		const cart = this._cartService.getCart();

		if (!cart[0].getBLID()) {
			this.registerUniqueItemModal = this._modalService.open(
				this.registerUniqueItemModalContent,
				{
					beforeDismiss: () => {
						this._cartService.endCheckoutProcess();
						return true;
					}
				}
			);
		} else {
			this.openCheckoutModal();
		}
	}

	public onUniqueItemsRegistered() {
		this.registerUniqueItemModal.close();
		this.openCheckoutModal();
	}

	private openCheckoutModal() {
		this.cartCheckoutModal = this._modalService.open(
			this.checkoutModalContent,
			{
				size: "lg",
				backdrop: "static",
				beforeDismiss: () => {
					this._cartService.endCheckoutProcess();
					return true;
				}
			}
		);
	}

	public onDismiss() {
		this.cartCheckoutModal.close();
		this._cartService.endCheckoutProcess();
	}

	public onCartConfirm() {
		this._cartService.endCheckoutProcess();
		this.cartCheckoutModal.close();
		this.cartConfirmed.emit(true);
	}

	private handleCartChange() {
		this.cart$ = this._cartService.subscribe(cart => {
			this.cart = cart;
			this.getTotalPriceInformation();
		});
	}
}
