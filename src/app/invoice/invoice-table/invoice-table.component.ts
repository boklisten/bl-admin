import { Component, OnInit, Input } from "@angular/core";
import { Invoice } from "@wizardcoder/bl-model";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
	selector: "app-invoice-table",
	templateUrl: "./invoice-table.component.html",
	styleUrls: ["./invoice-table.component.scss"]
})
export class InvoiceTableComponent implements OnInit {
	@Input() invoices: Invoice[];
	invoices$: Observable<Invoice[]>;
	public filter: FormControl;

	constructor() {
		this.filter = new FormControl("");

		this.invoices = [];

		this.invoices$ = this.filter.valueChanges.pipe(
			startWith(""),
			map(text => this.search(text))
		);
	}

	public search(text: string): Invoice[] {
		return this.invoices.filter(invoice => {
			const term = text.toLowerCase();
			return (
				invoice.customerInfo.name.toLowerCase().includes(term) ||
				invoice.reference.toString().includes(term)
			);
		});
	}

	ngOnInit() {}
}
