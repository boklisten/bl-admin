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
	public invoiceNumber: number;
	public reference: string;
  public fee: number;
  public feePercentage: number;

	constructor(
		customerItemService: CustomerItemService,
		private invoiceGeneratorService: InvoiceGeneratorService,
		private invoiceService: InvoiceService
	) {
		this.invoiceNumber = 201800000;
		this.invoices = [];
		this.reference = "Manglende levering av skolebøker";
    this.fee = 75;
    this.feePercentage = 1.1;
	}

	ngOnInit() {
		this.invoices = this.invoiceGeneratorService.getCurrentUnsavedInvoices();
	}

	public createInvoices() {
		this.invoiceGeneratorService
      .createInvoices({fee: this.fee, feePercentage: this.feePercentage},this.reference, this.invoiceNumber, this.period)
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
