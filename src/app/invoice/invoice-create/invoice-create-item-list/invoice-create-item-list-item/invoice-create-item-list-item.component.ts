import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { InvoiceItem } from "../invoice-item";

@Component({
	selector: "app-invoice-create-item-list-item",
	templateUrl: "./invoice-create-item-list-item.component.html",
	styleUrls: ["./invoice-create-item-list-item.component.scss"],
})
export class InvoiceCreateItemListItemComponent implements OnInit {
	@Input() invoiceItem: InvoiceItem;
	@Output() update: EventEmitter<boolean>;

	constructor() {
		this.update = new EventEmitter();
	}

	ngOnInit() {}

	public updateTotal() {
		this.invoiceItem.tax = this.calculateTax();
		this.invoiceItem.total =
			Number(this.invoiceItem.price) + this.invoiceItem.tax;
		this.update.emit(true);
	}

	private calculateTax(): number {
		const taxPercentage =
			Number(this.invoiceItem.taxPercentage) / 100;

		if (taxPercentage === 0) {
			return 0;
		}

		return this.invoiceItem.price * taxPercentage;
	}
}
