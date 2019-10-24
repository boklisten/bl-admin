import {
	Component,
	OnInit,
	OnChanges,
	EventEmitter,
	Input,
	Output,
	SimpleChanges
} from "@angular/core";
import { Invoice } from "@wizardcoder/bl-model";

@Component({
	selector: "app-invoice-id-select",
	templateUrl: "./invoice-id-select.component.html",
	styleUrls: ["./invoice-id-select.component.scss"]
})
export class InvoiceIdSelectComponent implements OnInit, OnChanges {
	@Input() invoices: Invoice[];
	@Input() id: string;
	@Output() idChange: EventEmitter<string>;
	public idOptions: string[];

	constructor() {
		this.idChange = new EventEmitter<string>();
	}

	ngOnInit() {}

	ngOnChanges(simpleChanges: SimpleChanges) {
		if (
			simpleChanges["invoices"] &&
			simpleChanges["invoices"].currentValue
		) {
			this.idOptions = this.generateIdOptions();
		}
	}

	public selectId(id: string) {
		this.id = id;
		this.idChange.emit(id);
	}

	private generateIdOptions() {
		let idOptions = [];

		for (let invoice of this.invoices) {
			let idSearchString = invoice.invoiceId.substring(0, 5);

			if (idOptions.indexOf(idSearchString) <= -1) {
				idOptions.push(idSearchString);
			}
		}
		return idOptions;
	}
}
