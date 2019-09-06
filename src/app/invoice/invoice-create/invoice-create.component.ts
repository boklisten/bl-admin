import { Component, OnInit } from "@angular/core";
import { InvoiceItem } from "./invoice-create-item-list/invoice-item";
import { Company } from "@wizardcoder/bl-model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { InvoiceCreateService } from "./invoice-create.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-invoice-create",
	templateUrl: "./invoice-create.component.html",
	styleUrls: ["./invoice-create.component.scss"]
})
export class InvoiceCreateComponent implements OnInit {
	private invoiceItemList: InvoiceItem[];
	private company: Company;
	public companyInvoiceForm: FormGroup;
	private total: number;
	public wait: boolean;

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
			invoiceNumber: new FormControl("", [Validators.required])
		});
	}

	ngOnInit() {}

	public onInvoiceItemListUpdate(invoiceItemList: InvoiceItem[]) {
		this.invoiceItemList = invoiceItemList;
		this.total = this.getTotal();
	}

	public onCompanyUpdate(company: Company) {
		this.company = company;
	}

	private getTotal() {
		let tot = 0;

		for (const invoiceItem of this.invoiceItemList) {
			tot += parseFloat(invoiceItem.total + "");
		}
		return tot;
	}

	public createInvoice() {
		this.wait = true;
		this.invoiceCreateService
			.createCompanyInvoice(
				this.companyInvoiceForm.controls["reference"].value,
				this.companyInvoiceForm.controls["ourReference"].value,
				this.companyInvoiceForm.controls["invoiceNumber"].value,
				this.company,
				this.invoiceItemList
			)
			.then(() => {
				this.wait = false;
				this.router.navigateByUrl("/invoices;tab=view");
			})
			.catch(() => {
				this.wait = false;
			});
	}
}
