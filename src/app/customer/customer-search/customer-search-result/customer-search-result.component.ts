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

	constructor(private _customerSearchService: CustomerSearchService, private _router: Router) {
		this._customerSearchService.onSearchResult().subscribe((userDetails: UserDetail[]) => {
			this.userDetails = userDetails;
		});
	}

	ngOnInit() {
	}

	onCustomerClick(userDetail: UserDetail) {
		this._router.navigate(['customer/' + userDetail.id + '/detail']);

	}

}
