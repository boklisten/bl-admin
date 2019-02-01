import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
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
	public selectAll: boolean;
	public selectedList: any;

	constructor() {
		this.selectAll = false;
		this.filter = new FormControl("");
		this.invoices = [];

		this.selectedList = {};

		this.invoices$ = this.filter.valueChanges.pipe(
			startWith(""),
			map(text => this.search(text))
		);
	}

	ngOnInit() {}

	public exportToExcel() {
		let selectedInvoices = this.getSelected();
		console.log("to excel", selectedInvoices);
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

	public onSelectAll() {
		this.selectAll = !this.selectAll;

		for (const invoice of this.search(this.filter.value)) {
			this.selectedList[invoice.id] = this.selectAll;
		}
	}

	public onSelect(id: string) {
		this.selectedList[id] = !this.selectedList[id];
	}

	public getSelected(): Invoice[] {
		let selectedInvoices = [];
		for (let invoice of this.invoices) {
			if (this.selectedList[invoice.id]) {
				selectedInvoices.push(invoice);
			}
		}
		return selectedInvoices;
	}
}
