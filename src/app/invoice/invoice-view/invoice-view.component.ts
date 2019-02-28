import { Component, OnInit } from "@angular/core";
import { InvoiceService } from "@wizardcoder/bl-connect";
import { Invoice } from "@wizardcoder/bl-model";

@Component({
	selector: "app-invoice-view",
	templateUrl: "./invoice-view.component.html",
	styleUrls: ["./invoice-view.component.scss"]
})
export class InvoiceViewComponent implements OnInit {
	invoices: Invoice[];
	selectedInvoice: Invoice;
	public wait: boolean;

	constructor(private invoiceService: InvoiceService) {}

	ngOnInit() {
		this.wait = true;
		this.invoiceService
			.get()
			.then(invoices => {
				this.invoices = invoices;
				this.wait = false;
			})
			.catch(err => {
				console.log("invoice err", err);
				this.wait = false;
			});
	}
}