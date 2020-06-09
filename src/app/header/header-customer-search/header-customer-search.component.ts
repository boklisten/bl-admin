import { Component, OnInit } from "@angular/core";
import { CustomerSearchService } from "../../customer/customer-search/customer-search.service";
import { BlcKeyeventDoubleShiftService } from "../../bl-common/blc-keyevent/blc-keyevent-double-shift.service";

@Component({
	selector: "app-header-customer-search",
	templateUrl: "./header-customer-search.component.html",
	styleUrls: ["./header-customer-search.component.scss"]
})
export class HeaderCustomerSearchComponent implements OnInit {
	public wait: boolean;
	public showSearchResult: boolean;
	public headerCustomerSearchId: string;

	constructor(
		private _customerSearchService: CustomerSearchService,
		private _blcKeyeventDoubleShiftService: BlcKeyeventDoubleShiftService
	) {}

	ngOnInit() {
		this.onSearchResult();
		this.onSearchResultError();
		this.showSearchResult = false;
		this.headerCustomerSearchId = "headerCustomerSearch";
		this.onDoubleShift();
	}

	private onDoubleShift() {
		this._blcKeyeventDoubleShiftService.onDoubleShift().subscribe(() => {
			document.getElementById(this.headerCustomerSearchId).focus();
			this.showSearchResult = true;
		});
	}

	public onSearchBarFocus() {
		this.showSearchResult = true;
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
