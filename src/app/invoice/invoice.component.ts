import { Component, OnInit, ViewChild } from "@angular/core";
import { InvoiceGeneratorService } from "./invoice-generator/invoice-generator.service";
import { PriceService } from "../price/price.service";
import { ActivatedRoute, Params } from "@angular/router";
import { NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-invoice",
	templateUrl: "./invoice.component.html",
	styleUrls: ["./invoice.component.scss"]
})
export class InvoiceComponent implements OnInit {
	public tab: string;
	@ViewChild("tabset") tabset;

	constructor(
		private priceService: PriceService,
		private _tabConfig: NgbTabsetConfig,
		private _route: ActivatedRoute
	) {}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this.tab = params["tab"];

			if (this.tab) {
				setTimeout(() => {
					this.tabset.select(this.tab);
				}, 10);
			}
		});
	}
}
