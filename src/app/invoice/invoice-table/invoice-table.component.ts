import {
	Component,
	Output,
	OnInit,
	Input,
	SimpleChanges,
	EventEmitter,
	OnChanges,
	Directive,
	ViewChildren,
	QueryList
} from "@angular/core";
import { Invoice } from "@wizardcoder/bl-model";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { InvoiceVismaService } from "../invoice-visma/invoice-visma.service";

export type SortDirection = "asc" | "desc" | "";
const rotate: { [key: string]: SortDirection } = {
	asc: "desc",
	desc: "",
	"": "asc"
};
export const compare = (v1, v2) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export interface SortEvent {
	column: string;
	direction: SortDirection;
}

@Directive({
	selector: "th[sortable]",
	host: {
		"[class.asc]": 'direction === "asc"',
		"[class.desc]": 'direction === "desc"',
		"(click)": "rotate()"
	}
})
export class NgbdSortableHeader {
	@Input() sortable: string;
	@Input() direction: SortDirection = "";
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}

@Component({
	selector: "app-invoice-table",
	templateUrl: "./invoice-table.component.html",
	styleUrls: ["./invoice-table.component.scss"]
})
export class InvoiceTableComponent implements OnInit, OnChanges {
	@Input() invoices: Invoice[];
	@Output() selectInvoice: EventEmitter<Invoice>;

	invoices$: Observable<Invoice[]>;
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

		this.selectedList = {};

		this.invoices$ = this.filter.valueChanges.pipe(
			startWith(""),
			map(text => this.search(text))
		);
	}

	ngOnInit() {}

	ngOnChanges(simpleChanges: SimpleChanges) {
		if (simpleChanges["invoices"].currentValue) {
			this.invoicesOrg = simpleChanges["invoices"].currentValue;
			this.onSelectInvoice(simpleChanges["invoices"].currentValue[0]);
		}
	}

	public sortInvoiceId() {
		if (this.sortByInvoiceIdDirection === "none") {
			this.sortByInvoiceIdDirection = "asc";
			this.invoices$ = this.filter.valueChanges.pipe(
				startWith(""),
				map(text =>
					this.invoices.sort(
						(a, b) => parseInt(b.invoiceId) - parseInt(a.invoiceId)
					)
				)
			);
		} else if (this.sortByInvoiceIdDirection === "asc") {
			this.sortByInvoiceIdDirection = "desc";
			this.invoices$ = this.filter.valueChanges.pipe(
				startWith(""),
				map(text =>
					this.invoices.sort(
						(a, b) => parseInt(a.invoiceId) - parseInt(b.invoiceId)
					)
				)
			);
		} else {
			this.sortByInvoiceIdDirection = "none";
			this.invoices$ = this.filter.valueChanges.pipe(
				startWith(""),
				map(text => this.search(text))
			);
		}
	}

	public exportToExcel() {
		let selectedInvoices = this.getSelected();
		this.printToExcelWait = true;

		this.invoiceVismaService
			.printToVismaInvoices(selectedInvoices)
			.then(() => {
				this.printToExcelWait = false;
			})
			.catch(() => {
				this.printToExcelWait = false;
			});
	}

	public search(text: string): Invoice[] {
		return this.invoices.filter(invoice => {
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
