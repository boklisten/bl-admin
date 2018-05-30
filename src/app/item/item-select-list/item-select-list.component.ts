import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Item} from '@wizardcoder/bl-model';
import {ItemService} from '@wizardcoder/bl-connect';

@Component({
	selector: 'app-item-select-list',
	templateUrl: './item-select-list.component.html',
	styleUrls: ['./item-select-list.component.scss']
})
export class ItemSelectListComponent implements OnInit, OnChanges {
	@Input() query: string;
	@Output() selectedItems: EventEmitter<Item[]>;

	public rows: Item[];
	public columns: any[];
	public temp: Item[];
	public selected: Item[];
	public items: Item[];

	constructor(private _itemService: ItemService) {
		this.columns = [];
		this.selected = [];
		this.items = [];
		this.temp = [];
		this.rows = [];
		this.selectedItems = new EventEmitter<Item[]>();
	}

	ngOnInit() {
		this._itemService.get(this.query).then((items: Item[]) => {
			this.items = items;
			this.temp = this.items;
		}).catch((getItemsError) => {
			console.log('ItemSelectListComponent: could not get items');
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		for (const propName in changes) {
			if (propName === 'items' && this.items) {
				this.temp = [...this.items];
			}
		}
	}

	onSelect({selected}) {
		this.selected.splice(0, this.selected.length);
		this.selected.push(...selected);
		this.selectedItems.emit(this.selected);
	}

	public updateFilter(event) {
		const val = event.target.value.toLowerCase();

		this.items = this.temp.filter((item: Item) => {
			return (item.title.toLowerCase().indexOf(val) !== -1
				|| (item.info && item.info.isbn
					&& (typeof item.info.isbn) === 'string'
					&& item.info.isbn.toLowerCase().indexOf(val) !== -1)
				|| val.length <= 0);
		});
	}
}
