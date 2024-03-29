import {
	Component,
	OnInit,
	OnDestroy,
	Output,
	EventEmitter,
	Input,
	SimpleChanges,
	OnChanges,
} from "@angular/core";
import { Item } from "@boklisten/bl-model";
import { ItemSearchService } from "../item-search/item-search.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-item-search-select",
	templateUrl: "./item-search-select.component.html",
	styleUrls: ["./item-search-select.component.scss"],
})
export class ItemSearchSelectComponent implements OnInit, OnDestroy, OnChanges {
	@Output() itemSelect: EventEmitter<Item>;
	@Input() item: Item;

	public items: Item[];
	public wait: boolean;
	private itemSearchResult$: Subscription;
	private itemSearchResultWait$: Subscription;
	public selectedItem: Item;
	public showInput: boolean;

	constructor(private _itemSearchService: ItemSearchService) {
		this.itemSelect = new EventEmitter();
	}

	ngOnInit() {
		this.selectedItem = null;
		this.handleItemSearchResultChange();
		this.handleItemSearchResultWaitChange();
	}

	ngOnDestroy() {
		this.itemSearchResult$.unsubscribe();
		this.itemSearchResultWait$.unsubscribe();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["item"]) {
			this.setSelectedItem(changes["item"].currentValue);
		}
	}

	public onShowInput() {
		this.showInput = !this.showInput;
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
		this.itemSearchResult$ = this._itemSearchService.subscribe((items) => {
			this.items = items;
			if (this.items.length == 1) {
				this.selectItem(0);
			}
		});
	}

	private handleItemSearchResultWaitChange() {
		this.itemSearchResultWait$ = this._itemSearchService.onWait((wait) => {
			this.wait = wait;
		});
	}
}
