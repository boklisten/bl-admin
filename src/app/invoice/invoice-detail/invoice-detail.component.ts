import {
	Component,
	OnInit,
	Input,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import { Invoice } from "@wizardcoder/bl-model";
import { InvoiceService } from "@wizardcoder/bl-connect";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
	selector: "app-invoice-detail",
	templateUrl: "./invoice-detail.component.html",
	styleUrls: ["./invoice-detail.component.scss"]
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
				this.invoiceService.getById(currentId).then(invoice => {
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
		this.invoiceService
			.update(this.invoice.id, { customerHavePayed: customerHavePayed })
			.then(() => {})
			.catch(err => {});
	}
}
