import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { CustomerItem, Item, Order, OrderItem } from "@wizardcoder/bl-model";
import { CartService } from "../../cart/cart.service";
import { BranchItemStoreService } from "../../branch/branch-item-store/branch-item-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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

	constructor(
		private _cartService: CartService,
		private _branchItemStoreService: BranchItemStoreService,
		private _modalService: NgbModal
	) {
		this.added = false;
	}

	ngOnInit() {
		this.checkIfAdded();

		this._cartService.onCartChange().subscribe(() => {
			this.checkIfAdded();
		});
	}

	public add() {}

	private checkIfAdded() {
		this.added = this._cartService.contains(
			this.orderItem ? (this.orderItem.item as string) : this.item.id
		);
	}

	public addItem() {
		if (!this.customerItem) {
			this.handleItem();
		} else {
			this.handleCustomerItem();
		}
		this._modalService.dismissAll();
	}

	public onClick() {
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
	}

	private openModal() {
		this._modalService.open(this.addWithWarningContent, {
			size: "lg",
			centered: true
		});
	}

	private handleCustomerItem() {
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
	}

	private handleOrderItem() {
		if (this._cartService.contains(this.orderItem.item as string)) {
			this._cartService.remove(this.orderItem.item as string);
			this.added = false;
		} else {
			this._cartService.addOrderItem(this.orderItem, this.order);
			this.added = true;
		}
	}

	private handleItem() {
		if (this._cartService.contains(this.item.id)) {
			this._cartService.remove(this.item.id);
			this.added = false;
		} else {
			this._cartService.add(this.item);
			this.added = true;
		}
	}
}
