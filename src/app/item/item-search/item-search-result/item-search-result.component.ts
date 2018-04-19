import {Component, OnInit} from '@angular/core';
import {Item} from '@wizardcoder/bl-model';
import {ItemSearchService} from '../item-search.service';

@Component({
	selector: 'app-item-search-result',
	templateUrl: './item-search-result.component.html',
	styleUrls: ['./item-search-result.component.scss']
})
export class ItemSearchResultComponent implements OnInit {
	public items: Item[];

	constructor(private _itemSearchService: ItemSearchService) {
	}

	ngOnInit() {
		if (this._itemSearchService.getSearchTerm()) {
			this.items = this._itemSearchService.getSearchResult();
		}

		this._itemSearchService.onSearchResult().subscribe(() => {
			console.log('tehre was update', this._itemSearchService.getSearchResult());
			this.items = this._itemSearchService.getSearchResult();
		});

		this._itemSearchService.onSearchResultError().subscribe(() => {

		});
	}

}
