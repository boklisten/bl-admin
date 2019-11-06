import { Component, OnInit } from "@angular/core";
import { ItemSearchService } from "./item-search.service";

@Component({
	selector: "app-item-search",
	templateUrl: "./item-search.component.html",
	styleUrls: ["./item-search.component.scss"]
})
export class ItemSearchComponent implements OnInit {
	public wait: boolean;
	public searchTerm: string;

	constructor(private _itemSearchService: ItemSearchService) {}

	ngOnInit() {
		if (this._itemSearchService.getSearchTerm()) {
			this.searchTerm = this._itemSearchService.getSearchTerm();
		}

		this._itemSearchService.onSearchResult().subscribe(() => {
			this.wait = false;
		});

		this._itemSearchService.onSearchResultError().subscribe(() => {
			this.wait = false;
		});
	}

	onSearch(term: string) {
		this.wait = true;
		this._itemSearchService.search(term);
	}
}
