import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { BlidScannerService } from "../../scanner/blid-scanner/blid-scanner.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CartItemService } from "../../cart/cart-item/cart-item.service";
import { CartService } from "../../cart/cart.service";
import { UniqueItem } from "@wizardcoder/bl-model";
import { Subscription } from "rxjs";
import { UniqueItemScanToCartService } from "./unique-item-scan-to-cart.service";

@Component({
	selector: "app-unique-item-scan-to-cart",
	templateUrl: "./unique-item-scan-to-cart.component.html",
	styleUrls: ["./unique-item-scan-to-cart.component.scss"]
})
export class UniqueItemScanToCartComponent implements OnInit, OnDestroy {
	@ViewChild("addUniqeItemModal") private addUniqeItemModal;

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
	) {
		this.handleUniqueItemChange();
		this.handleUniqueItemNotExistChange();
	}

	ngOnInit() {}

	ngOnDestroy() {
		this.uniqueItem$.unsubscribe();
		this.uniqueItemDoesNotExist$.unsubscribe();
	}

	public onUniqueItemRegistered(uniqueItem: UniqueItem) {
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
				this._modalService.open(this.addUniqeItemModal);
			}
		);
	}

	private addUniqueItemToCart(uniqueItem: UniqueItem) {
		this._uniqueItemScanToCartService
			.addUniqueItemToCart(uniqueItem)
			.then(added => {})
			.catch(e => {
				console.log("could not add cart item", e);
			});
	}
}
