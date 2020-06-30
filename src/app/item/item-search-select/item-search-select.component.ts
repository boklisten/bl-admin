import {
	Component,
	OnInit,
	OnDestroy,
	Output,
	EventEmitter
} from "@angular/core";
import { Item } from "@wizardcoder/bl-model";
import { ItemSearchService } from "../item-search/item-search.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-item-search-select",
	templateUrl: "./item-search-select.component.html",
	styleUrls: ["./item-search-select.component.scss"]
})
export class ItemSearchSelectComponent implements OnInit, OnDestroy {
	@Output() itemSelect: EventEmitter<Item>;

	public items: Item[];
	public wait: boolean;
	private itemSearchResult$: Subscription;
	private itemSearchResultWait$: Subscription;
	public selectedItem: Item;

	constructor(private _itemSearchService: ItemSearchService) {
		this.itemSelect = new EventEmitter();
	}

	ngOnInit() {
		this.handleItemSearchResultChange();
		this.handleItemSearchResultWaitChange();
	}

	ngOnDestroy() {
		this.itemSearchResult$.unsubscribe();
		this.itemSearchResultWait$.unsubscribe();
	}

	public selectItem(index: number) {
		this.setSelectedItem(this.items[index]);
	}

	public onChangeItem() {
		this.setSelectedItem(null);
	}

	private setSelectedItem(item: Item) {
		this.selectedItem = item;
		this.itemSelect.emit(this.selectedItem);
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
