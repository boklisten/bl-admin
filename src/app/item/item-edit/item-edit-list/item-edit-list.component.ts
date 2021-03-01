import {
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
} from "@angular/core";
import { Item } from "@boklisten/bl-model";
import { ItemService } from "@boklisten/bl-connect";
import { DatabaseExcelService } from "../../../database/database-excel/database-excel.service";
import { BlcSortService } from "../../../bl-common/blc-sort/blc-sort.service";

@Component({
	selector: "app-item-edit-list",
	templateUrl: "./item-edit-list.component.html",
	styleUrls: ["./item-edit-list.component.scss"],
})
export class ItemEditListComponent implements OnInit, OnChanges {
	@Input() items: Item[];
	@Input() autoUpdate: boolean;
	@Input() editable: boolean;
	@Input() uploadList: boolean;
	@ViewChild("itemEditTable") table: any;

	public rows: Item[];
	public columns: any[];
	public editing = {};
	public updating = {};
	public expanded = {};
	public temp: Item[];
	public selected: Item[];

	constructor(
		private _itemService: ItemService,
		private _changeDetectionRef: ChangeDetectorRef,
		private _databaseExcelService: DatabaseExcelService,
		private blcSortService: BlcSortService
	) {
		this.columns = [];
		this.selected = [];
		this.items = [];
		this.temp = [];
		this.rows = [];
	}

	onDownloadSelected() {
		this._databaseExcelService.objectsToExcelFile(this.selected, "items");
	}

	ngOnInit() {
		if (!this.uploadList) {
			this._itemService
				.get()
				.then((items: Item[]) => {
					this.items = this.blcSortService.sortByField(
						items,
						"title"
					);
				})
				.catch((err) => {
					console.log(
						"DatabaseItemsComponent: could not get items",
						err
					);
				});
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		for (const propName in changes) {
			if (propName === "items" && this.items) {
				this.temp = [...this.items];
			}
		}
	}

	onSelect({ selected }) {
		this.selected.splice(0, this.selected.length);
		this.selected.push(...selected);
	}

	add() {}

	updateRowItem(rowIndex: number, colName: string) {
		this.editing[rowIndex + colName] = false;

		if (this.autoUpdate) {
			this.updateItemToDb(rowIndex, colName);
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

	private updateItemToDb(rowIndex: number, colName: string) {
		this.updating[rowIndex] = true;

		this._itemService
			.update(this.items[rowIndex].id, this.items[rowIndex])
			.then((updatedItem: Item) => {
				this.editing[rowIndex + colName] = false;
				this.updating[rowIndex] = false;
				this.items[rowIndex] = updatedItem;
				this.items = [...this.items];
			})
			.catch((updateItemError) => {
				console.log(
					"itemEditListComponent: could not update item",
					updateItemError
				);
				this.updating[rowIndex] = false;
			});
	}

	private updateItem(rowIndex: number, cell: string) {
		const updateData = {};
		updateData[cell] = this.items[rowIndex][cell];

		const itemCell = this.items[rowIndex].id + this.items[rowIndex].title;

		this.updating[itemCell] = true;

		this._itemService
			.update(this.items[rowIndex].id, updateData)
			.then((updatedItem: Item) => {
				this.updating[itemCell] = false;
				this.items[rowIndex] = updatedItem;
				this.items = [...this.items];
				this._changeDetectionRef.markForCheck();
			})
			.catch((updateError) => {
				console.log(
					"itemEditListComponent: could not update item",
					updateError
				);
				this.updating[itemCell] = false;
			});
	}

	public toggleExpandRow(row) {
		this.table.rowDetail.toggleExpandRow(row);
	}

	public onDetailToggle(event) {}

	public updateFilter(event) {
		const val = event.target.value.toLowerCase();

		this.items = this.temp.filter((item: Item) => {
			return (
				item.title.toLowerCase().indexOf(val) !== -1 ||
				(item.info &&
					item.info.isbn &&
					typeof item.info.isbn === "string" &&
					item.info.isbn.toLowerCase().indexOf(val) !== -1) ||
				val.length <= 0
			);
		});
	}

	public uploadSelected() {
		for (const selectedItem of this.selected) {
			const itemCell = selectedItem.id + selectedItem.title;

			if (!selectedItem.id || selectedItem.id.length <= 0) {
				this.updating[itemCell] = true;

				this._itemService
					.add(selectedItem)
					.then((addedItem: Item) => {
						this.updating[itemCell] = false;
						this.removeItemFromList(addedItem.title);

						this.items = [...this.items];
					})
					.catch((err) => {
						console.log(
							"itemEditListComponent: could not add item",
							err
						);
					});
			} else {
				this.updating[itemCell] = true;
				this._itemService
					.update(selectedItem.id, selectedItem)
					.then((updatedItem) => {
						this.updating[itemCell] = false;
						this.removeItemFromList(updatedItem.title);
					})
					.catch((err) => {
						this.updating[itemCell] = false;
						console.log(
							"itemEditListComponent: could not update item",
							err
						);
					});
			}
		}
	}

	private removeItemFromList(title) {
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].title === title) {
				this.items.splice(i, 1);
				break;
			}
		}
	}
}
