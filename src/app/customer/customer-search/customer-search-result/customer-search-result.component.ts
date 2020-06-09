import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CustomerSearchService } from "../customer-search.service";
import { UserDetail } from "@wizardcoder/bl-model";
import { Router } from "@angular/router";
import { CustomerService } from "../../customer.service";

@Component({
	selector: "app-customer-search-result",
	templateUrl: "./customer-search-result.component.html",
	styleUrls: ["./customer-search-result.component.scss"]
})
export class CustomerSearchResultComponent implements OnInit {
	public userDetails: UserDetail[];
	public warningText: string;

	@Output() clicked: EventEmitter<boolean>;

	constructor(
		private _customerSearchService: CustomerSearchService,
		private _router: Router,
		private _customerService: CustomerService
	) {
		this.clicked = new EventEmitter<boolean>();

		this._customerSearchService
			.onSearchResult()
			.subscribe((userDetails: UserDetail[]) => {
				this.warningText = null;
				this.userDetails = userDetails;
			});

		this._customerSearchService.onSearchResultError().subscribe(() => {
			this.userDetails = [];
			this.warningText =
				"Could not find any customer with the current search term";
		});
	}

	ngOnInit() {}

	onCustomerClick(customerDetail: UserDetail) {
		this.clicked.emit(true);
		this._customerService.set(customerDetail.id);
		this._router.navigate(["/cart"]);
	}
}
