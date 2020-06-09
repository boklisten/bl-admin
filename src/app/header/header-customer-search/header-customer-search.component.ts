import { Component, OnInit } from "@angular/core";
import { CustomerSearchService } from "../../customer/customer-search/customer-search.service";

@Component({
	selector: "app-header-customer-search",
	templateUrl: "./header-customer-search.component.html",
	styleUrls: ["./header-customer-search.component.scss"]
})
export class HeaderCustomerSearchComponent implements OnInit {
	public wait: boolean;
	public showSearchResult: boolean;

	constructor(private _customerSearchService: CustomerSearchService) {}

	ngOnInit() {
		this.onSearchResult();
		this.onSearchResultError();
		this.showSearchResult = false;
	}

	public onSearchResultClick() {
		this.showSearchResult = false;
	}

	public onCustomerSearch(searchTerm: string) {
		if (searchTerm && searchTerm.length > 3) {
			this.wait = true;
			this._customerSearchService.search(searchTerm);
		}
	}

	private onSearchResult() {
		this._customerSearchService.onSearchResult().subscribe(() => {
			this.wait = false;
			this.showSearchResult = true;
		});
	}

	private onSearchResultError() {
		this._customerSearchService.onSearchResultError().subscribe(() => {
			this.wait = false;
			this.showSearchResult = true;
		});
	}
}
