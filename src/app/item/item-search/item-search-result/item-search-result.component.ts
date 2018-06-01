import {Component, OnInit} from '@angular/core';
import {Item} from '@wizardcoder/bl-model';
import {ItemSearchService} from '../item-search.service';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {BranchItemHelperService} from '../../../branch/branch-item-helper/branch-item-helper.service';

@Component({
	selector: 'app-item-search-result',
	templateUrl: './item-search-result.component.html',
	styleUrls: ['./item-search-result.component.scss']
})
export class ItemSearchResultComponent implements OnInit {
	public items: Item[];
	public notFoundError: string;

	constructor(private _itemSearchService: ItemSearchService, private _branchItemHelperService: BranchItemHelperService) {
	}

	ngOnInit() {
		if (this._itemSearchService.getSearchTerm()) {
			this.items = this._itemSearchService.getSearchResult();
		}

		this._itemSearchService.onSearchResult().subscribe(() => {
			this.items = this._itemSearchService.getSearchResult();
			this.notFoundError = null;
		});

		this._itemSearchService.onSearchResultError().subscribe(() => {
			this.notFoundError = 'Could not find any item';
			this.items = [];
		});
	}

	isRentValid(item: Item, periodType: Period): boolean {
		return this._branchItemHelperService.isRentValid(item, periodType);
	}

	isBuyValid(item: Item) {
		return this._branchItemHelperService.isBuyValid(item);
	}

	isSellValid(item: Item) {
		return this._branchItemHelperService.isSellValid(item);
	}

}
