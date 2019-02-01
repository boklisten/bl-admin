import { Component, OnInit } from "@angular/core";
import { CustomerItemService, InvoiceService } from "@wizardcoder/bl-connect";
import { InvoiceGeneratorService } from "./invoice-generator.service";
import { Invoice } from "@wizardcoder/bl-model";

@Component({
	selector: "app-invoice-generator",
	templateUrl: "./invoice-generator.component.html",
	styleUrls: ["./invoice-generator.component.scss"]
})
export class InvoiceGeneratorComponent implements OnInit {
	public invoices: Invoice[];
	public period: { fromDate: Date; toDate: Date };
	public reference: number;

	constructor(
		customerItemService: CustomerItemService,
		private invoiceGeneratorService: InvoiceGeneratorService,
		private invoiceService: InvoiceService
	) {
		this.reference = 201800000;
		this.invoices = [];
	}

	ngOnInit() {
		this.invoices = this.invoiceGeneratorService.getCurrentUnsavedInvoices();
	}

	public createInvoices() {
		this.invoiceGeneratorService
			.createInvoices(this.reference, this.period)
			.then(invoices => {
				this.invoices = invoices;
				this.invoiceGeneratorService.setUnsavedInvoices(invoices);
			});
	}

	public addInvoices() {
		this.invoiceGeneratorService
			.addInvoices(this.invoices)
			.then(addedInvoices => {
				if (addedInvoices.length === this.invoices.length) {
					this.invoices = [];
				}
			})
			.catch(err => {
				console.log("could not add invoices", err);
			});
	}

	public onPeriodChange(period) {
		this.period = period;
	}
}
