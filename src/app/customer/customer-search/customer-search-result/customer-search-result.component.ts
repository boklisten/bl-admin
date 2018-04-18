import {Component, OnInit} from '@angular/core';
import {CustomerSearchService} from '../customer-search.service';
import {UserDetail} from '@wizardcoder/bl-model';
import {Router} from '@angular/router';

@Component({
	selector: 'app-customer-search-result',
	templateUrl: './customer-search-result.component.html',
	styleUrls: ['./customer-search-result.component.scss']
})
export class CustomerSearchResultComponent implements OnInit {

	public userDetails: UserDetail[];
	public warningText: string;

	constructor(private _customerSearchService: CustomerSearchService, private _router: Router) {

		this._customerSearchService.onSearchResult().subscribe((userDetails: UserDetail[]) => {
			this.warningText = null;
			this.userDetails = userDetails;
		});

		this._customerSearchService.onSearchResultError().subscribe(() => {
			this.userDetails = [];
			this.warningText = 'Could not find any customer with the current search term';
		});
	}

	ngOnInit() {
	}

	onCustomerClick(userDetail: UserDetail) {
		this._router.navigate(['customer/' + userDetail.id + '/detail']);
	}

}
