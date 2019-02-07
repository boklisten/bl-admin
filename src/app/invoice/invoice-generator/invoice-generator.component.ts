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
	public daysToDeadline: number;
	public wait: boolean;
	public waitAdd: boolean;

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
		this.daysToDeadline = 14;
	}

	ngOnInit() {
		this.invoices = this.invoiceGeneratorService.getCurrentUnsavedInvoices();
	}

	public createInvoices() {
		this.wait = true;
		this.invoiceGeneratorService
			.createInvoices(
				{
					fee: this.fee,
					feePercentage: this.feePercentage,
					daysToDeadline: this.daysToDeadline
				},
				this.reference,
				this.invoiceNumber,
				this.period
			)
			.then(invoices => {
				this.wait = false;
				this.invoices = invoices;
				this.invoiceGeneratorService.setUnsavedInvoices(invoices);
			})
			.catch(() => {
				this.wait = false;
			});
	}

	public addInvoices() {
		this.waitAdd = true;
		this.invoiceGeneratorService
			.addInvoices(this.invoices)
			.then(addedInvoices => {
				this.waitAdd = false;
				if (addedInvoices.length === this.invoices.length) {
					this.invoices = [];
				}
			})
			.catch(err => {
				this.waitAdd = false;
				console.log("could not add invoices", err);
			});
	}

	public onPeriodChange(period) {
		this.period = period;
	}
}
