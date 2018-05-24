import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Item} from '@wizardcoder/bl-model';
import {ItemService} from '@wizardcoder/bl-connect';
import {selectRows} from '@swimlane/ngx-datatable/release/utils';

@Component({
	selector: 'app-item-edit-list',
	templateUrl: './item-edit-list.component.html',
	styleUrls: ['./item-edit-list.component.scss']
})
export class ItemEditListComponent implements OnInit, OnChanges {
	@Input() items: Item[];
	@Input() autoUpdate: boolean;
	@ViewChild('itemEditTable') table: any;

	public rows: any[];
	public columns: any[];
	public editing = {};
	public updating = {};
	public expanded = {};
	public temp: any[];

	constructor(private _itemService: ItemService, private _changeDetectionRef: ChangeDetectorRef) {
		this.columns = [
			{prop: 'title'},
			{name: 'id'},
			{name: 'price'},
			{name: 'types'},
			{name: 'rent'},
			{name: 'buy'},
			{name: 'sell'},
			{name: 'active'},
			{name: 'action'}
		];
	}

	ngOnInit() {
		this.temp = [...this.items];

		console.log('the temp', this.temp);
	}

	ngOnChanges(changes: SimpleChanges) {
		for (const propName in changes) {
			if (propName === 'items') {
				this.temp = [...this.items];
			}
		}
	}


	updateValue(value, cell: string, rowIndex: number) {
		this.editing[rowIndex + cell] = false;
		this.items[rowIndex][cell] = value;
		this.items = [...this.items];

		if (this.autoUpdate) {
			this.updateItem(rowIndex, cell);
		}
	}


	private updateItem(rowIndex: number, cell: string) {
		const updateData = {};
		updateData[cell] = this.items[rowIndex][cell];

		this.updating[this.items[rowIndex].id] = true;

		this._itemService.update(this.items[rowIndex].id, updateData).then((updatedItem: Item) => {
			this.updating[this.items[rowIndex].id] = false;
			this.items[rowIndex] = updatedItem;
			this.items = [...this.items];
			this._changeDetectionRef.markForCheck();
		}).catch((updateError) => {
			console.log('itemEditListComponent: could not update item', updateError);
			this.updating[this.items[rowIndex].id] = false;
		});
	}

	public toggleExpandRow(row) {
		this.table.rowDetail.toggleExpandRow(row);
	}

	public onDetailToggle(event) {

	}

	public updateFilter(event) {
		const val = event.target.value.toLowerCase();

		this.items = this.temp.filter((item: Item) => {
			return (item.title.toLowerCase().indexOf(val) !== -1 || (item.info && item.info.isbn && item.info.isbn.toLowerCase().indexOf(val) !== -1) || val.length <= 0);
		});
	}


}
