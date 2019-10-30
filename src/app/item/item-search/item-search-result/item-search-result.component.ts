import { Component, OnInit } from "@angular/core";
import { Item } from "@wizardcoder/bl-model";
import { ItemSearchService } from "../item-search.service";
import { Period } from "@wizardcoder/bl-model/dist/period/period";
import { BranchItemHelperService } from "../../../branch/branch-item-helper/branch-item-helper.service";
import { BlcSortService } from "../../../bl-common/blc-sort/blc-sort.service";

@Component({
	selector: "app-item-search-result",
	templateUrl: "./item-search-result.component.html",
	styleUrls: ["./item-search-result.component.scss"]
})
export class ItemSearchResultComponent implements OnInit {
	public items: Item[];
	public notFoundError: string;

	constructor(
		private _itemSearchService: ItemSearchService,
		private _branchItemHelperService: BranchItemHelperService,
		private blcSortService: BlcSortService
	) {}

	ngOnInit() {
		if (this._itemSearchService.getSearchTerm()) {
			this.items = this.getSearchResult();
		}

		this._itemSearchService.onSearchResult().subscribe(() => {
			this.items = this.getSearchResult();
			this.notFoundError = null;
		});

		this._itemSearchService.onSearchResultError().subscribe(() => {
			this.notFoundError = "Could not find any item";
			this.items = [];
		});
	}

	private getSearchResult(): Item[] {
		return this.blcSortService.sortByField(
			this._itemSearchService.getSearchResult(),
			"title"
		);
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
