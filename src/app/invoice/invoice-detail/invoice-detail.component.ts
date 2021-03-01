import {
	Component,
	OnInit,
	Input,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { Invoice } from "@boklisten/bl-model";
import { InvoiceService } from "@boklisten/bl-connect";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
	selector: "app-invoice-detail",
	templateUrl: "./invoice-detail.component.html",
	styleUrls: ["./invoice-detail.component.scss"],
})
export class InvoiceDetailComponent implements OnInit, OnChanges {
	@Input() invoice: Invoice;

	constructor(
		private invoiceService: InvoiceService,
		private route: ActivatedRoute
	) {}

	public ngOnInit() {
		this.route.params.subscribe((params: Params) => {
			const currentId = params["id"];
			if (currentId) {
				this.invoiceService.getById(currentId).then((invoice) => {
					this.invoice = invoice as any;
				});
			}
		});
	}

	public ngOnChanges(simpleChanges: SimpleChanges) {
		if (simpleChanges["inputInvoice"]) {
			this.invoice = simpleChanges.inputInvoice.currentValue;
		}
	}

	public onCustomerHavePayedChange(customerHavePayed: boolean) {
		this.invoice.customerHavePayed = customerHavePayed;
		this.invoice.toDebtCollection = false;
		this.invoice.toCreditNote = false;
		this.updateInvoiceStatus();
	}

	public onInvoiceToDebtCollection(toDebtCollection: boolean) {
		this.invoice.toDebtCollection = toDebtCollection;
		this.invoice.customerHavePayed = false;
		this.invoice.toCreditNote = false;
		this.updateInvoiceStatus();
	}

	public onInvoiceToCreditNote(toCreditNote: boolean) {
		this.invoice.toCreditNote = toCreditNote;
		this.invoice.customerHavePayed = false;
		this.invoice.toDebtCollection = false;
		this.updateInvoiceStatus();
	}

	private updateInvoiceStatus() {
		this.invoiceService
			.update(this.invoice.id, {
				toCreditNote: this.invoice.toCreditNote,
				toDebtCollection: this.invoice.toDebtCollection,
				customerHavePayed: this.invoice.customerHavePayed,
			})
			.then(() => {})
			.catch((err) => {});
	}

	public onCustomerItemPaymentCancel(index: number) {
		this.invoice.customerItemPayments[index].cancel = !this.invoice
			.customerItemPayments[index].cancel;
		this.invoiceService
			.update(this.invoice.id, {
				customerItemPayments: this.invoice.customerItemPayments,
			})
			.then(() => {})
			.catch((err) => {});
	}
}
