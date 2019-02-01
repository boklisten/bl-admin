import { Component, OnInit } from "@angular/core";
import { InvoiceGeneratorService } from "./invoice-generator/invoice-generator.service";

@Component({
	selector: "app-invoice",
	templateUrl: "./invoice.component.html",
	styleUrls: ["./invoice.component.scss"]
})
export class InvoiceComponent implements OnInit {
	constructor(private invoiceGeneratorService: InvoiceGeneratorService) {}

	ngOnInit() {
	}
}
