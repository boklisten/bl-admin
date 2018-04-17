import {Component, OnInit} from '@angular/core';
import {CustomerSearchService} from './customer-search.service';

@Component({
	selector: 'app-customer-search',
	templateUrl: './customer-search.component.html',
	styleUrls: ['./customer-search.component.scss']
})
export class CustomerSearchComponent implements OnInit {
	public searchTerm: string;

	constructor(private _customerSearchService: CustomerSearchService) {
		this.searchTerm = '';
	}

	ngOnInit() {
		if (this._customerSearchService.getSearchTerm()) {
			this.searchTerm = this._customerSearchService.getSearchTerm();
			this._customerSearchService.search(this.searchTerm);
		}
	}

	onSearch() {
		if (this.searchTerm && this.searchTerm.length > 2) {
			this._customerSearchService.search(this.searchTerm);
		}
	}

}
