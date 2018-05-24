import {Component, OnInit} from '@angular/core';
import {ItemService} from '@wizardcoder/bl-connect';
import {Item} from '@wizardcoder/bl-model';
import {DatabaseExcelService} from '../database-excel/database-excel.service';
import {DateService} from '../../date/date.service';

@Component({
	selector: 'app-database-items',
	templateUrl: './database-items.component.html',
	styleUrls: ['./database-items.component.scss']
})
export class DatabaseItemsComponent implements OnInit {
	public databaseItems: Item[];

	constructor(private _itemService: ItemService, private _databaseExcelService: DatabaseExcelService, private _dateService: DateService) {
		this.databaseItems = [];
	}

	ngOnInit() {
		this._itemService.get().then((items: Item[]) => {
			this.databaseItems = items;
		}).catch((err) => {
			console.log('DatabaseItemsComponent: could not get items', err);
		});
	}


	onDownloadItems() {
		this._itemService.get().then((items: Item[]) => {
			this._databaseExcelService.objectsToExcelFile(items, 'items_' + this._dateService.currentDateCompact() + '.xlsx');
		}).catch((err) => {
			console.log('ItemUploadComponent: could not get the items', err);
		});
	}

}
