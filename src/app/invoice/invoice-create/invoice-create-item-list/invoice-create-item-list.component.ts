import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CartService } from "../../../cart/cart.service";
import { CartItem } from "../../../cart/cartItem";
import { InvoiceItem } from "./invoice-item";

@Component({
	selector: "app-invoice-create-item-list",
	templateUrl: "./invoice-create-item-list.component.html",
	styleUrls: ["./invoice-create-item-list.component.scss"]
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
		this._cartService.onCartChange().subscribe(() => {
			this.cart = this._cartService.getCart();
			this.setInvoiceItems();
		});
	}

	public createInvoice() {
		let grandTotal = 0;
		for (const invoiceItem of this.invoiceItems) {
			grandTotal += parseFloat(invoiceItem.total + "");
		}
	}

	public onInvoiceItemUpdate() {
		this.invoiceItemList.emit(this.invoiceItems);
	}

	private setInvoiceItems() {
		const newInvoiceItems: any[] = [];
		let productNumber = 1;

		for (const cartItem of this.cart) {
			let alreadyAddedInvoiceItem = null;

			for (const invoiceItem of this.invoiceItems) {
				if (cartItem.item.id === invoiceItem.item.id) {
					alreadyAddedInvoiceItem = invoiceItem;
				}
			}

			if (!alreadyAddedInvoiceItem) {
				newInvoiceItems.push({
					title: cartItem.item.title,
					comment: "",
					item: cartItem.item,
					price: cartItem.item.price,
					discount: 0,
					numberOfUnits: 1,
					productNumber: productNumber,
					total: cartItem.item.price
				});
			} else {
				newInvoiceItems.push(alreadyAddedInvoiceItem);
			}
		}

		this.invoiceItems = newInvoiceItems;
		this.invoiceItemList.emit(newInvoiceItems);
	}
}
