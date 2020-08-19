import { Component, Input, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { CustomerItem, Item, Order, OrderItem } from "@wizardcoder/bl-model";
import { CartService } from "../../cart/cart.service";
import { BranchItemStoreService } from "../../branch/branch-item-store/branch-item-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CartItemService } from "../../cart/cart-item/cart-item.service";
import { CartItem } from "../../cart/cart-item/cart-item";
import { Subscription } from "rxjs";

@Component({
	selector: "app-blc-item-add",
	templateUrl: "./blc-item-add.component.html",
	styleUrls: ["./blc-item-add.component.scss"]
})
export class BlcItemAddComponent implements OnInit, OnDestroy {
	@Input() item: Item;
	@Input() orderItem: OrderItem;
	@Input() order: Order;
	@Input() customerItem: CustomerItem;
	public addWarningItem: boolean;
	public addWarningCustomerItem: boolean;
	@ViewChild("addWithWarningContent") private addWithWarningContent;

	public added: boolean;
	public cartItem: CartItem;
	private cartChange$: Subscription;

	constructor(
		private _cartService: CartService,
		private _branchItemStoreService: BranchItemStoreService,
		private _modalService: NgbModal,
		private _cartItemService: CartItemService
	) {
		this.added = false;
	}

	ngOnInit() {
		this.createCartItem()
			.then(() => {
				this.checkIfAdded();
				this.handleCartChange();
			})
			.catch(err => {
				console.log("chould not create cart item", err);
			});
	}

	ngOnDestroy() {
		this.cartChange$.unsubscribe();
	}

	private handleCartChange() {
		this.cartChange$ = this._cartService.subscribe(() => {
			this.checkIfAdded();
		});
	}

	private createCartItem(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (!this.customerItem && !this.orderItem && this.item) {
				this.cartItem = this._cartItemService.createCartItemByItem(
					this.item
				);
				resolve(true);
			}

			if (!this.orderItem && this.customerItem) {
				return this._cartItemService
					.createCartItemByCustomerItem(this.customerItem)
					.then(cartItem => {
						this.cartItem = cartItem;
						resolve(true);
					})
					.catch(err => {
						reject(err);
					});
			}

			if (!this.customerItem && this.orderItem) {
				this._cartItemService
					.createCartItemByOrderItem(this.orderItem, this.order)
					.then(cartItem => {
						this.cartItem = cartItem;
						resolve(true);
					})
					.catch(err => {
						reject(err);
					});
			}
		});
	}

	public add() {
		this.addWarningItem = false;
		if (
			!this._branchItemStoreService.isItemInBranchItems(
				this.cartItem.getItemId()
			)
		) {
			this.addWarningItem = true;
			this.openModal();
			return;
		}
		this.addCartItem();
	}

	public addCartItem() {
		this._modalService.dismissAll();
		try {
			this._cartService.add(this.cartItem);
		} catch (e) {
			console.log("blc-item-add.add(): could not add item", e);
		}
	}

	private checkIfAdded() {
		this.added = this._cartService.contains(this.cartItem);
	}

	public remove() {
		this._cartService.remove(this.cartItem);
	}

	public onClick() {
		if (this.added) {
			this.remove();
		} else {
			this.add();
		}
	}

	private openModal() {
		this._modalService.open(this.addWithWarningContent, {
			size: "lg"
		});
	}
}
