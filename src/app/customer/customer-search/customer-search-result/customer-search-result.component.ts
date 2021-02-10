import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	OnDestroy
} from "@angular/core";
import { CustomerSearchService } from "../customer-search.service";
import { UserDetail } from "@boklisten/bl-model";
import { Router } from "@angular/router";
import { CustomerService } from "../../customer.service";
import { BlcArrowUpService } from "../../../bl-common/blc-key/blc-arrow-up/blc-arrow-up.service";
import { BlcArrowDownService } from "../../../bl-common/blc-key/blc-arrow-down.service";
import { BlcEnterService } from "../../../bl-common/blc-key/blc-enter/blc-enter.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-customer-search-result",
	templateUrl: "./customer-search-result.component.html",
	styleUrls: ["./customer-search-result.component.scss"]
})
export class CustomerSearchResultComponent implements OnInit, OnDestroy {
	public wait: boolean;
	public userDetails: UserDetail[];
	public warningText: string;
	public listIndex: number;
	private searchResultError$: Subscription;
	private arrowUp$: Subscription;
	private arrowDown$: Subscription;
	private enter$: Subscription;
	private searchResult$: Subscription;
	private searchResultWait$: Subscription;
	private searchTerm$: Subscription;
	private canShowNotFoundAlert: boolean;

	@Output() clicked: EventEmitter<boolean>;

	constructor(
		private _customerSearchService: CustomerSearchService,
		private _customerService: CustomerService,
		private _blcArrowDownService: BlcArrowDownService,
		private _blcArrowUpService: BlcArrowUpService,
		private _blcEnterService: BlcEnterService,
		private _router: Router
	) {
		this.userDetails = [];
		this.clicked = new EventEmitter<boolean>();
		this.listIndex = -1;
	}

	ngOnInit() {
		this.handleSearchResultChange();
		this.handleSearchResultErrorChange();
		this.handleSearchWaitChange();
		this.handleSearchTermChange();
		this.handleArrowUpEvent();
		this.handleArrowDownEvent();
		this.handleEnterEvent();
	}

	ngOnDestroy() {
		this.searchResult$.unsubscribe();
		this.searchResultError$.unsubscribe();
		this.searchResultWait$.unsubscribe();
		this.searchTerm$.unsubscribe();
		this.enter$.unsubscribe();
		this.arrowUp$.unsubscribe();
		this.arrowDown$.unsubscribe();
	}

	public onCustomerClick(customerDetail: UserDetail) {
		this.clicked.emit(true);
		this._customerService.set(customerDetail.id);
		this._router.navigate(["/cart"]);
	}

	private handleSearchResultChange() {
		this.searchResult$ = this._customerSearchService
			.onSearchResult()
			.subscribe((userDetails: UserDetail[]) => {
				this.listIndex = -1;
				this.warningText = null;
				this.userDetails = userDetails;
			});
	}

	private handleSearchResultErrorChange() {
		this.searchResultError$ = this._customerSearchService
			.onSearchResultError()
			.subscribe(() => {
				this.userDetails = [];
			});
	}

	private handleSearchWaitChange() {
		this.searchResultWait$ = this._customerSearchService.onWait(wait => {
			this.wait = wait;
		});
	}

	private handleSearchTermChange() {
		this.searchTerm$ = this._customerSearchService.onSearchTerm(term => {
			if (!term || term.length < 3) {
				this.canShowNotFoundAlert = false;
			} else {
				this.canShowNotFoundAlert = true;
			}
		});
	}

	private handleArrowUpEvent() {
		this.arrowUp$ = this._blcArrowUpService.subscribe(() => {
			if (this.listIndex > -1) {
				this.listIndex--;
			}
		});
	}

	private handleArrowDownEvent() {
		this.arrowDown$ = this._blcArrowDownService.subscribe(() => {
			if (this.listIndex < this.userDetails.length - 1) {
				this.listIndex++;
			}
		});
	}

	private handleEnterEvent() {
		this.enter$ = this._blcEnterService.subscribe(() => {
			if (
				this.listIndex > -1 &&
				this.listIndex < this.userDetails.length
			) {
				this.onCustomerClick(this.userDetails[this.listIndex]);
				this.listIndex = -1;
			}
		});
	}
}
