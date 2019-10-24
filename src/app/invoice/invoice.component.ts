import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { InvoiceGeneratorService } from "./invoice-generator/invoice-generator.service";
import { PriceService } from "../price/price.service";
import { ActivatedRoute, Params } from "@angular/router";
import { NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-invoice",
	templateUrl: "./invoice.component.html",
	styleUrls: ["./invoice.component.scss"]
})
export class InvoiceComponent implements OnInit, AfterViewInit {
	public tab: string;
	@ViewChild("tabset") tabset;

	constructor(
		private priceService: PriceService,
		private _tabConfig: NgbTabsetConfig,
		private _route: ActivatedRoute
	) {}

	ngOnInit() {
		this.tab = this._route.snapshot.firstChild.url[0].path;
	}

	ngAfterViewInit() {
		this.tabset.select(this.tab);
	}
}
