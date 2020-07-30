import { Component, OnInit, ViewChild, OnDestroy, Input } from "@angular/core";
import { BlidScannerService } from "../../scanner/blid-scanner/blid-scanner.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CartItemService } from "../../cart/cart-item/cart-item.service";
import { CartService } from "../../cart/cart.service";
import { UniqueItem, Order } from "@wizardcoder/bl-model";
import { Subscription } from "rxjs";
import { UniqueItemScanToCartService } from "../unique-item-scan-to-cart/unique-item-scan-to-cart.service";

@Component({
	selector: "app-unique-item-scan-order-to-cart",
	templateUrl: "./unique-item-scan-order-to-cart.component.html",
	styleUrls: ["./unique-item-scan-order-to-cart.component.scss"]
})
export class UniqueItemScanOrderToCartComponent implements OnInit {
	@ViewChild("addUniqeItemModal") private addUniqeItemModalContent;
	@Input() order: Order;
	private addUniqeItemModal: NgbModalRef;

	private uniqueItem$: Subscription;
	private uniqueItemDoesNotExist$: Subscription;
	public blid: string;
	public uniqueItem: UniqueItem;
	public notAddedUniqeItemBlid: string;

	constructor(
		private _modalService: NgbModal,
		private _blidScannerService: BlidScannerService,
		private _cartItemService: CartItemService,
		private _cartService: CartService,
		private _uniqueItemScanToCartService: UniqueItemScanToCartService
	) {}

	ngOnInit() {
		this.handleUniqueItemChange();
		this.handleUniqueItemNotExistChange();
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
			this.addUniqueItemToCart(uniqueItem);
		});
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
			.addOrderItemAsUniqueItemToCart(this.order, uniqueItem)
			.then(added => {})
			.catch(e => {
				console.log("could not add cart item", e);
			});
	}
}
