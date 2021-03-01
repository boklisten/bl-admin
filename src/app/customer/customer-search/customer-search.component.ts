import { Component, OnInit } from "@angular/core";
import { CustomerSearchService } from "./customer-search.service";

@Component({
	selector: "app-customer-search",
	templateUrl: "./customer-search.component.html",
	styleUrls: ["./customer-search.component.scss"],
})
export class CustomerSearchComponent implements OnInit {
	public searchTerm: string;
	public wait: boolean;

	constructor(private _customerSearchService: CustomerSearchService) {
		this.searchTerm = "";
		this.wait = false;

		this._customerSearchService.onSearchResult().subscribe(() => {
			this.wait = false;
		});

		this._customerSearchService.onSearchResultError().subscribe(() => {
			this.wait = false;
		});
	}

	ngOnInit() {
		if (this._customerSearchService.getSearchTerm()) {
			this.searchTerm = this._customerSearchService.getSearchTerm();
			this.onSearch(this.searchTerm);
		}
	}

	onSearch(searchTerm: string) {
		if (searchTerm && searchTerm.length > 2) {
			this.wait = true;
			this._customerSearchService.search(searchTerm);
		}
	}

	onSearchBarClick() {
		this.onSearch(this.searchTerm);
	}
}
