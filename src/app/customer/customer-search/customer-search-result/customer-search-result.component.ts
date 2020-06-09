import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	OnDestroy
} from "@angular/core";
import { CustomerSearchService } from "../customer-search.service";
import { UserDetail } from "@wizardcoder/bl-model";
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
	public userDetails: UserDetail[];
	public warningText: string;
	public listIndex: number;
	private searchResultError$: Subscription;
	private arrowUp$: Subscription;
	private arrowDown$: Subscription;
	private enter$: Subscription;
	private searchResult$: Subscription;

	@Output() clicked: EventEmitter<boolean>;

	constructor(
		private _customerSearchService: CustomerSearchService,
		private _router: Router,
		private _customerService: CustomerService,
		private _blcArrowDownService: BlcArrowDownService,
		private _blcArrowUpService: BlcArrowUpService,
		private _blcEnterService: BlcEnterService
	) {
		this.clicked = new EventEmitter<boolean>();
		this.listIndex = -1;
	}

	ngOnInit() {
		this.searchResult$ = this._customerSearchService
			.onSearchResult()
			.subscribe((userDetails: UserDetail[]) => {
				this.listIndex = -1;
				this.warningText = null;
				this.userDetails = userDetails;
			});

		this.searchResultError$ = this._customerSearchService
			.onSearchResultError()
			.subscribe(() => {
				this.userDetails = [];
				this.warningText =
					"Could not find any customer with the current search term";
			});

		this.arrowUp$ = this._blcArrowUpService.subscribe(() => {
			if (this.listIndex > -1) {
				this.listIndex--;
			}
		});

		this.arrowDown$ = this._blcArrowDownService.subscribe(() => {
			if (this.listIndex < this.userDetails.length - 1) {
				this.listIndex++;
			}
		});

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

	ngOnDestroy() {
		this.enter$.unsubscribe();
		this.searchResultError$.unsubscribe();
		this.arrowUp$.unsubscribe();
		this.arrowDown$.unsubscribe();
		this.searchResult$.unsubscribe();
	}

	onCustomerClick(customerDetail: UserDetail) {
		this.clicked.emit(true);
		this._customerService.set(customerDetail.id);
		this._router.navigate(["/cart"]);
	}
}
