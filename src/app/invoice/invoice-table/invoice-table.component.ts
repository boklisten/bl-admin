import {
	Component,
	Output,
	OnInit,
	Input,
	SimpleChanges,
	EventEmitter,
	OnChanges,
} from "@angular/core";
import { Invoice } from "@boklisten/bl-model";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { InvoiceVismaService } from "../invoice-visma/invoice-visma.service";

@Component({
	selector: "app-invoice-table",
	templateUrl: "./invoice-table.component.html",
	styleUrls: ["./invoice-table.component.scss"],
})
export class InvoiceTableComponent implements OnInit, OnChanges {
	@Input() invoices: Invoice[];
	@Output() selectInvoice: EventEmitter<Invoice>;

	invoices$: Observable<Invoice[]>;
	public idSearchString: string;
	public filter: FormControl;
	public selectAll: boolean;
	public selectedList: any;
	public selectedInvoice: Invoice;
	public printToExcelWait: boolean;
	public invoicesOrg;
	public sortByInvoiceIdDirection: "asc" | "desc" | "none";

	constructor(private invoiceVismaService: InvoiceVismaService) {
		this.selectInvoice = new EventEmitter<Invoice>();
		this.selectAll = false;
		this.filter = new FormControl("");
		this.invoices = [];
		this.invoicesOrg = [];
		this.sortByInvoiceIdDirection = "none";
		this.idSearchString = null;

		this.selectedList = {};

		this.invoices$ = this.filter.valueChanges.pipe(
			startWith(""),
			map((text) => this.search(text))
		);
	}

	ngOnInit() {}

	ngOnChanges(simpleChanges: SimpleChanges) {
		if (simpleChanges["invoices"].currentValue) {
			this.invoicesOrg = simpleChanges["invoices"].currentValue;
		}
	}

	public setIdSearchString(idSearchString: string) {
		this.idSearchString = idSearchString;
		this.invoices$ = this.filter.valueChanges.pipe(
			startWith(""),
			map(() => {
				return this.search(idSearchString);
			})
		);
		this.selectedInvoice = null;
		this.selectInvoice.emit(null);
	}

	public sortInvoiceId() {
		if (this.sortByInvoiceIdDirection === "none") {
			this.sortByInvoiceIdDirection = "asc";
			this.invoices$ = this.filter.valueChanges.pipe(
				startWith(""),
				map((text) => {
					this.invoices.sort(
						(a, b) => parseInt(b.invoiceId) - parseInt(a.invoiceId)
					);
					return this.search(text);
				})
			);
		} else if (this.sortByInvoiceIdDirection === "asc") {
			this.sortByInvoiceIdDirection = "desc";
			this.invoices$ = this.filter.valueChanges.pipe(
				startWith(""),
				map((text) => {
					this.invoices.sort(
						(a, b) => parseInt(a.invoiceId) - parseInt(b.invoiceId)
					);
					return this.search(text);
				})
			);
		} else {
			this.sortByInvoiceIdDirection = "none";
			this.invoices$ = this.filter.valueChanges.pipe(
				startWith(""),
				map((text) => this.search(text))
			);
		}
	}

	public exportToExcel(ehf: boolean, isCreditOfInvoice: boolean) {
		const selectedInvoices = this.getSelected();
		this.printToExcelWait = true;

		this.invoiceVismaService
			.printToVismaInvoices(selectedInvoices, ehf, isCreditOfInvoice)
			.then(() => {
				this.printToExcelWait = false;
			})
			.catch(() => {
				this.printToExcelWait = false;
			});
	}

	public exportToExcelTripletex() {
		const selectedInvoices = this.getSelected();
		this.printToExcelWait = true;

		this.invoiceVismaService
			.printToTripletexInvoices(selectedInvoices)
			.then(() => {
				this.printToExcelWait = false;
			})
			.catch(() => {
				this.printToExcelWait = false;
			});
	}

	public search(text: string): Invoice[] {
		return this.invoices.filter((invoice) => {
			const term = text.toLowerCase();
			return (
				invoice.customerInfo.name.toLowerCase().includes(term) ||
				invoice.invoiceId.toString().includes(term)
			);
		});
	}

	public onSelectInvoice(invoice: Invoice) {
		this.selectedInvoice = invoice;
		this.selectInvoice.emit(invoice);
	}

	public haveSelected() {
		return this.getSelected().length > 0;
	}

	public onSelectAll() {
		this.selectAll = !this.selectAll;
		let searchString = this.filter.value;

		if (!searchString || searchString.length <= 0) {
			searchString = this.idSearchString;
		}

		for (const invoice of this.search(searchString)) {
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
