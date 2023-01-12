import { Component, OnInit } from "@angular/core";
import { InvoiceItem } from "./invoice-create-item-list/invoice-item";
import { Company } from "@boklisten/bl-model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { InvoiceCreateService } from "./invoice-create.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-invoice-create",
	templateUrl: "./invoice-create.component.html",
	styleUrls: ["./invoice-create.component.scss"],
})
export class InvoiceCreateComponent implements OnInit {
	public invoiceItemList: InvoiceItem[];
	public company: Company;
	public companyInvoiceForm: FormGroup;
	public invoiceCommentForm: FormGroup;
	public total: number;
	public wait: boolean;
	public createInvoiceError: boolean;

	constructor(
		private invoiceCreateService: InvoiceCreateService,
		private router: Router
	) {
		this.invoiceItemList = [];
		this.total = 0;
		this.wait = false;
		this.companyInvoiceForm = new FormGroup({
			reference: new FormControl("", [Validators.required]),
			ourReference: new FormControl("", [Validators.required]),
			invoiceNumber: new FormControl("", [Validators.required]),
		});

		this.invoiceCommentForm = new FormGroup({
			comment: new FormControl(""),
		});
	}

	ngOnInit() {}

	private calculateTax(invoiceItem: InvoiceItem): number {
		const taxPercentage = Number(invoiceItem.taxPercentage) / 100;

		if (taxPercentage === 0) {
			return 0;
		}

		return invoiceItem.price * taxPercentage;
	}

	private getDiscountedTotal(invoiceItem: InvoiceItem): number {
		const discount = 1 - Number("0." + invoiceItem.discount);
		return (
			(Number(invoiceItem.price) * discount +
				this.calculateTax(invoiceItem)) *
			invoiceItem.numberOfUnits
		);
	}

	public onInvoiceItemListUpdate(invoiceItemList: InvoiceItem[]) {
		this.invoiceItemList = invoiceItemList;
		this.total = this.invoiceItemList.reduce(
			(total, nextItem) => total + this.getDiscountedTotal(nextItem),
			0
		);
	}

	public onCompanyUpdate(company: Company) {
		this.company = company;
	}

	public createInvoice() {
		this.wait = true;
		this.createInvoiceError = false;
		this.invoiceCreateService
			.createCompanyInvoice(
				this.companyInvoiceForm.controls["reference"].value,
				this.companyInvoiceForm.controls["ourReference"].value,
				this.companyInvoiceForm.controls["invoiceNumber"].value,
				this.company,
				this.invoiceItemList,
				this.invoiceCommentForm.controls["comment"].value
			)
			.then(() => {
				this.wait = false;
				this.router.navigate(["/invoices/view"]);
			})
			.catch((err) => {
				this.wait = false;
				this.createInvoiceError = true;
			});
	}
}
