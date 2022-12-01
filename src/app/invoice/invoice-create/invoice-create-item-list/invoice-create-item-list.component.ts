import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CartService } from "../../../cart/cart.service";
import { InvoiceItem } from "./invoice-item";
import { CartItem } from "../../../cart/cart-item/cart-item";

@Component({
	selector: "app-invoice-create-item-list",
	templateUrl: "./invoice-create-item-list.component.html",
	styleUrls: ["./invoice-create-item-list.component.scss"],
})
export class InvoiceCreateItemListComponent implements OnInit {
	@Output() invoiceItemList: EventEmitter<InvoiceItem[]>;
	public cart: CartItem[];
	public invoiceItems: InvoiceItem[];

	constructor(private _cartService: CartService) {
		this.invoiceItemList = new EventEmitter();
	}

	ngOnInit() {
		this.invoiceItems = [];
		this._cartService.subscribe(() => {
			this.cart = this._cartService.getCart();
			this.setInvoiceItems();
		});
	}

	public onInvoiceItemUpdate() {
		this.invoiceItemList.emit(this.invoiceItems);
	}

	private setInvoiceItems() {
		const newInvoiceItems: any[] = [];
		const productNumber = 1;

		for (const cartItem of this.cart) {
			let alreadyAddedInvoiceItem = null;

			for (const invoiceItem of this.invoiceItems) {
				if (cartItem.getItemId() === invoiceItem.item.id) {
					alreadyAddedInvoiceItem = invoiceItem;
				}
			}

			if (!alreadyAddedInvoiceItem) {
				newInvoiceItems.push({
					title: cartItem.getTitle(),
					comment: "",
					item: cartItem.getItem(),
					price: cartItem.getItem().price,
					discount: 0,
					numberOfUnits: 1,
					productNumber: productNumber,
					total: cartItem.getItem().price,
					tax: 0,
					taxPercentage: 0,
				});
			} else {
				newInvoiceItems.push(alreadyAddedInvoiceItem);
			}
		}

		this.invoiceItems = newInvoiceItems;
		this.invoiceItemList.emit(newInvoiceItems);
	}
}
