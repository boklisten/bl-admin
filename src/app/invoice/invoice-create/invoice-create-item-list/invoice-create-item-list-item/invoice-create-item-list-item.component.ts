import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { InvoiceItem } from "../invoice-item";
import { PriceService } from "../../../../price/price.service";

@Component({
	selector: "app-invoice-create-item-list-item",
	templateUrl: "./invoice-create-item-list-item.component.html",
	styleUrls: ["./invoice-create-item-list-item.component.scss"]
})
export class InvoiceCreateItemListItemComponent implements OnInit {
	@Input() invoiceItem: InvoiceItem;
	@Output() update: EventEmitter<boolean>;

	constructor(private priceService: PriceService) {
		this.update = new EventEmitter();
	}

	ngOnInit() {}

	public updateTotal() {
		this.invoiceItem.total = this.priceService.toFixed(
			this.invoiceItem.price *
				this.invoiceItem.numberOfUnits *
				(1 - parseInt(this.invoiceItem.discount + "") / 100)
		);
		this.update.emit(true);
	}
}
