import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { BlidScannerService } from "../../scanner/blid-scanner/blid-scanner.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CartItemService } from "../../cart/cart-item/cart-item.service";
import { CartService } from "../../cart/cart.service";
import { UniqueItem, CustomerItem, Item } from "@wizardcoder/bl-model";
import { Subscription } from "rxjs";
import { UniqueItemScanToCartService } from "./unique-item-scan-to-cart.service";
import { UniqueItemService } from "@wizardcoder/bl-connect";
import { CustomerItemListService } from "../../customer-item/customer-item-list/customer-item-list.service";
import { AuthService } from "../../auth/auth.service";

@Component({
	selector: "app-unique-item-scan-to-cart",
	templateUrl: "./unique-item-scan-to-cart.component.html",
	styleUrls: ["./unique-item-scan-to-cart.component.scss"]
})
export class UniqueItemScanToCartComponent implements OnInit, OnDestroy {
	@ViewChild("addUniqeItemModal") private addUniqeItemModalContent;
	private addUniqeItemModal: NgbModalRef;

	@ViewChild("anotherBlidOnCustomerItemModal")
	private anotherBlidOnCustomerItemModalContent;
	private anotherBlidOnCustomerItemModal: NgbModalRef;

	private uniqueItem$: Subscription;
	private uniqueItemDoesNotExist$: Subscription;
	public blid: string;
	public uniqueItem: UniqueItem;
	public notAddedUniqeItemBlid: string;
	public mismatchedCustomerItemWithItem: {
		customerItem: CustomerItem;
		item: Item;
	};
	public wait: boolean;
	public isAdmin: boolean;

	constructor(
		private _modalService: NgbModal,
		private _blidScannerService: BlidScannerService,
		private _cartItemService: CartItemService,
		private _cartService: CartService,
		private _uniqueItemScanToCartService: UniqueItemScanToCartService,
		private _uniqueItemService: UniqueItemService,
		private _customerItemListService: CustomerItemListService,
		private _authService: AuthService
	) {}

	ngOnInit() {
		this.handleUniqueItemChange();
		this.handleUniqueItemNotExistChange();
		this.isAdmin = this._authService.isAdmin();
	}

	ngOnDestroy() {
		this.uniqueItem$.unsubscribe();
		this.uniqueItemDoesNotExist$.unsubscribe();
	}

	public onUniqueItemRegistered(uniqueItem: UniqueItem) {
		this._cartService.clearLock();
		this._modalService.dismissAll();
		this.addUniqueItemToCart(uniqueItem);
	}

	private handleUniqueItemChange() {
		this.uniqueItem$ = this._blidScannerService.onUniqueItem(uniqueItem => {
			this.uniqueItem = uniqueItem;

			const customerItemWithItem = this._customerItemListService.containsMismatchedBlid(
				uniqueItem
			);

			if (customerItemWithItem) {
				if (!this._modalService.hasOpenModals()) {
					this.mismatchedCustomerItemWithItem = customerItemWithItem;
					this.anotherBlidOnCustomerItemModal = this._modalService.open(
						this.anotherBlidOnCustomerItemModalContent
					);
				}
				return;
			}

			this.addUniqueItemToCart(uniqueItem);
		});
	}

	public onAddUniqueItemAnywayClick(uniqueItem: UniqueItem) {
		this.anotherBlidOnCustomerItemModal.close();
		this.addUniqueItemToCart(uniqueItem);
	}

	public onCancelModal() {
		this._modalService.dismissAll();
	}

	private handleUniqueItemNotExistChange() {
		this.uniqueItemDoesNotExist$ = this._blidScannerService.onUniqueItemDoesNotExist(
			blid => {
				this.notAddedUniqeItemBlid = blid;
				this._modalService.dismissAll();
				this._cartService.setLock();
				this.addUniqeItemModal = this._modalService.open(
					this.addUniqeItemModalContent,
					{
						beforeDismiss: () => {
							this._cartService.clearLock();
							return true;
						}
					}
				);
			}
		);
	}

	private addUniqueItemToCart(uniqueItem: UniqueItem) {
		this._uniqueItemScanToCartService
			.addUniqueItemToCart(uniqueItem)
			.then(added => {
				/*
				this._uniqueItemService
					.getWithOperation(uniqueItem.id, "active")
					.then(result => {
						console.log("RESULT", result);
					})
					.catch(e => {
						console.log("could not check if uniqueItem is active");
					});
         */
			})
			.catch(e => {
				console.log("could not add cart item", e);
			});
	}
}
