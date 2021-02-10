import { Component, OnInit } from "@angular/core";
import { ItemService } from "@boklisten/bl-connect";
import { Item } from "@boklisten/bl-model";
import { DatabaseExcelService } from "../database-excel/database-excel.service";
import { DateService } from "../../date/date.service";
import { BlcSortService } from "../../bl-common/blc-sort/blc-sort.service";

@Component({
	selector: "app-database-items",
	templateUrl: "./database-items.component.html",
	styleUrls: ["./database-items.component.scss"]
})
export class DatabaseItemsComponent implements OnInit {
	public databaseItems: Item[];

	constructor(
		private _itemService: ItemService,
		private _databaseExcelService: DatabaseExcelService,
		private _dateService: DateService,
		private blcSortService: BlcSortService
	) {
		this.databaseItems = [];
	}

	ngOnInit() {
		this._itemService
			.get()
			.then((items: Item[]) => {
				this.databaseItems = this.blcSortService.sortByField(
					items,
					"title"
				);
			})
			.catch(err => {
				console.log("DatabaseItemsComponent: could not get items", err);
			});
	}

	onDownloadItems() {
		this._itemService
			.get()
			.then((items: Item[]) => {
				this._databaseExcelService.objectsToExcelFile(
					items,
					"items_" + this._dateService.currentDateCompact() + ".xlsx"
				);
			})
			.catch(err => {
				console.log(
					"ItemUploadComponent: could not get the items",
					err
				);
			});
	}
}
