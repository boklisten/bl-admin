import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	OnDestroy
} from "@angular/core";
import { CustomerSearchService } from "../../customer/customer-search/customer-search.service";
import { BlcKeyeventDoubleShiftService } from "../../bl-common/blc-keyevent/blc-keyevent-double-shift.service";
import { BlcClickService } from "../../bl-common/blc-click/blc-click.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-header-customer-search",
	templateUrl: "./header-customer-search.component.html",
	styleUrls: ["./header-customer-search.component.scss"]
})
export class HeaderCustomerSearchComponent implements OnInit, OnDestroy {
	public wait: boolean;
	public showSearchResult: boolean;
	public headerCustomerSearchId: string;
	public searchTerm: string;
	private customerSearchResult$: Subscription;
	private customerSearchResultError$: Subscription;
	private customerSearchResultWait$: Subscription;
	private clickEvent$: Subscription;
	private doubleShiftEvent$: Subscription;

	@ViewChild("customerSearchResult", { read: ElementRef })
	customerSearchResultChild: ElementRef;

	@ViewChild("customerSearchBar", { read: ElementRef })
	customerSearchBarChild: ElementRef;

	constructor(
		private _customerSearchService: CustomerSearchService,
		private _blcKeyeventDoubleShiftService: BlcKeyeventDoubleShiftService,
		private _blcClickService: BlcClickService
	) {
		this.searchTerm = "";
		this.showSearchResult = false;
		this.headerCustomerSearchId = "headerCustomerSearch";
	}

	ngOnInit() {
		this.handleCustomerSearchResultChange();
		this.handleCustomerResultErrorChange();
		this.handleCustomerSearchResultWaitChange();
		this.handleClickEvent();
		this.handleDoubleShiftEvent();
	}

	ngOnDestroy() {
		this.customerSearchResult$.unsubscribe();
		this.customerSearchResultError$.unsubscribe();
		this.customerSearchResultWait$.unsubscribe();
		this.clickEvent$.unsubscribe();
		this.doubleShiftEvent$.unsubscribe();
	}

	public onSearchBarFocus() {
		this.showSearchResult = true;
	}

	public onSearchResultClick() {
		this.customerSearchBarChild.nativeElement.childNodes
			.item("#headerCustomerSearch")
			.childNodes[0].blur();
		this.showSearchResult = false;
	}

	public onCustomerSearch(searchTerm: string) {
		this._customerSearchService.search(searchTerm);
	}

	private handleCustomerSearchResultChange() {
		this.customerSearchResult$ = this._customerSearchService
			.onSearchResult()
			.subscribe(() => {
				this.showSearchResult = true;
			});
	}

	private handleCustomerResultErrorChange() {
		this.customerSearchResultError$ = this._customerSearchService
			.onSearchResultError()
			.subscribe(() => {
				this.showSearchResult = true;
			});
	}

	private handleCustomerSearchResultWaitChange() {
		this.customerSearchResultWait$ = this._customerSearchService.onWait(
			wait => {
				this.wait = wait;
			}
		);
	}

	private handleClickEvent() {
		this.clickEvent$ = this._blcClickService.onClick(target => {
			if (this.customerSearchResultChild) {
				if (this.clickedOutsideSearchBarAndResult(target)) {
					this.showSearchResult = false;
				}
			}
		});
	}

	private clickedOutsideSearchBarAndResult(target: HTMLElement) {
		return (
			!this.customerSearchResultChild.nativeElement.contains(target) &&
			!this.customerSearchBarChild.nativeElement.contains(target)
		);
	}

	private handleDoubleShiftEvent() {
		this.doubleShiftEvent$ = this._blcKeyeventDoubleShiftService
			.onDoubleShift()
			.subscribe(() => {
				document.getElementById(this.headerCustomerSearchId).focus();
				this.showSearchResult = true;
			});
	}
}
