import { Component, OnInit, OnDestroy } from "@angular/core";
import { ItemSearchService } from "../item-search/item-search.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-item-search-bar",
	templateUrl: "./item-search-bar.component.html",
	styleUrls: ["./item-search-bar.component.scss"]
})
export class ItemSearchBarComponent implements OnInit, OnDestroy {
	public wait: boolean;
	public searchTerm: string;
	private itemSearchResultWait$: Subscription;

	constructor(private _itemSearchService: ItemSearchService) {}

	ngOnInit() {
		this.handleItemSearchResultWaitChange();
	}

	ngOnDestroy() {
		this.itemSearchResultWait$.unsubscribe();
	}

	public onSearch(term: string | number) {
		this._itemSearchService.search(term);
	}

	private handleItemSearchResultWaitChange() {
		this.itemSearchResultWait$ = this._itemSearchService.onWait(wait => {
			this.wait = wait;
		});
	}
}
