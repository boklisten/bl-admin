import { Component, OnInit, OnDestroy } from "@angular/core";
import { Item } from "@wizardcoder/bl-model";
import { ItemSearchService } from "../item-search.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-item-search-result",
	templateUrl: "./item-search-result.component.html",
	styleUrls: ["./item-search-result.component.scss"]
})
export class ItemSearchResultComponent implements OnInit, OnDestroy {
	public items: Item[];
	public notFoundError: string;
	public wait: boolean;

	private itemSearchResult$: Subscription;
	private itemSearchResultWait$: Subscription;

	constructor(private _itemSearchService: ItemSearchService) {}

	ngOnInit() {
		this.handleItemSearchResultChange();
		this.handleItemSearchResultWaitChange();
	}

	ngOnDestroy() {
		this.itemSearchResult$.unsubscribe();
		this.itemSearchResultWait$.unsubscribe();
	}

	private handleItemSearchResultChange() {
		this.itemSearchResult$ = this._itemSearchService.subscribe(items => {
			this.items = items;
		});
	}

	private handleItemSearchResultWaitChange() {
		this.itemSearchResultWait$ = this._itemSearchService.onWait(wait => {
			this.wait = wait;
		});
	}
}
