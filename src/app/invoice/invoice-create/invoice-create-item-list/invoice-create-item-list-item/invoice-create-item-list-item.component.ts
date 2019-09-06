import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { InvoiceItem } from "../invoice-item";

@Component({
	selector: "app-invoice-create-item-list-item",
	templateUrl: "./invoice-create-item-list-item.component.html",
	styleUrls: ["./invoice-create-item-list-item.component.scss"]
})
export class InvoiceCreateItemListItemComponent implements OnInit {
	@Input() invoiceItem: InvoiceItem;
	@Output() update: EventEmitter<boolean>;

	constructor() {
		this.update = new EventEmitter();
	}

	ngOnInit() {}

	public updateTotal() {
		this.invoiceItem.total =
			this.invoiceItem.price *
			this.invoiceItem.numberOfUnits *
			(1 - this.invoiceItem.discount);
		this.update.emit(true);
	}
}
