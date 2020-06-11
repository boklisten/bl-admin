import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { CustomerItem, Item, Order, OrderItem } from "@wizardcoder/bl-model";
import { CartService } from "../../cart/cart.service";
import { BranchItemStoreService } from "../../branch/branch-item-store/branch-item-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CartItemService } from "../../cart/cart-item/cart-item.service";
import { CartItem } from "../../cart/cart-item/cart-item";

@Component({
	selector: "app-blc-item-add",
	templateUrl: "./blc-item-add.component.html",
	styleUrls: ["./blc-item-add.component.scss"]
})
export class BlcItemAddComponent implements OnInit {
	@Input() item: Item;
	@Input() orderItem: OrderItem;
	@Input() order: Order;
	@Input() customerItem: CustomerItem;
	public addWarningItem: boolean;
	public addWarningCustomerItem: boolean;
	@ViewChild("addWithWarningContent") private addWithWarningContent;

	public added: boolean;
	public cartItem: CartItem;

	constructor(
		private _cartService: CartService,
		private _branchItemStoreService: BranchItemStoreService,
		private _modalService: NgbModal,
		private _cartItemService: CartItemService
	) {
		this.added = false;
	}

	ngOnInit() {
		this.createCartItem();
		/*
		this.checkIfAdded();

		this._cartService.subscribe(() => {
			this.checkIfAdded();
		});
    */
	}

	private createCartItem() {
		this.cartItem = this._cartItemService.createCartItemByItem(this.item);
	}

	public add() {
		try {
			this._cartService.add(this.cartItem);
		} catch (e) {
			console.log("blc-item-add.add(): could not add item", e);
		}
	}

	private checkIfAdded() {
		this.added = this._cartService.contains(this.cartItem);
	}
	/*
	public addItem() {
		if (!this.customerItem) {
			this.handleItem();
		} else {
			this.handleCustomerItem();
		}
		this._modalService.dismissAll();
	}
  */

	public onClick() {
		console.log("blc-item-add.onClick(): clicked add");
		console.log("blc-item-add.item", this.item);
		console.log("blc-item-add.customerItem", this.customerItem);
		console.log("blc-item-add.orderItem", this.orderItem);
		console.log("blc-item-add.order", this.order);
		this.add();
		/*
		if (this.order && this.orderItem) {
			this.handleOrderItem();
		} else if (this.customerItem) {
			if (!this.added && this.customerItem["match"]) {
				this.addWarningCustomerItem = true;
				this.addWarningItem = false;
				this.openModal();
			} else {
				this.handleCustomerItem();
			}
		} else {
			if (
				!this._branchItemStoreService.isItemInBranchItems(
					this.item.id
				) &&
				!this.added
			) {
				this.addWarningItem = true;
				this.addWarningCustomerItem = false;
				this.openModal();
			} else {
				this.handleItem();
			}
		}
    */
	}

	private openModal() {
		this._modalService.open(this.addWithWarningContent, {
			size: "lg",
			centered: true
		});
	}

	private handleCustomerItem() {
		/*
		if (this._cartService.contains(this.customerItem.item as string)) {
			this._cartService.remove(this.customerItem.item as string);
			this.added = false;
		} else {
			this._cartService.addCustomerItem(
				this.customerItem,
				this.item ? this.item : null
			);
			this.added = true;
		}
    */
	}

	private handleOrderItem() {
		/*
		if (this._cartService.contains(this.orderItem.item as string)) {
			this._cartService.remove(this.orderItem.item as string);
			this.added = false;
		} else {
			this._cartService.addOrderItem(this.orderItem, this.order);
			this.added = true;
		}
    */
	}

	private handleItem() {
		/*
		if (this._cartService.contains(this.item.id)) {
			this._cartService.remove(this.item.id);
			this.added = false;
		} else {
			this._cartService.add(this.item);
			this.added = true;
		}
   */
	}
}
