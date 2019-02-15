import { Component, OnInit } from "@angular/core";
import { InvoiceGeneratorService } from "./invoice-generator/invoice-generator.service";
import { PriceService } from "../price/price.service";

@Component({
	selector: "app-invoice",
	templateUrl: "./invoice.component.html",
	styleUrls: ["./invoice.component.scss"]
})
export class InvoiceComponent implements OnInit {
	constructor(private priceService: PriceService) {}

	ngOnInit() {
		//console.log("@", this.priceService.toFixed(750 * 1.1));
	}
}
