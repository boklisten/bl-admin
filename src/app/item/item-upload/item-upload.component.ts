import {Component, OnInit} from '@angular/core';
import {DatabaseExcelService} from '../../database/database-excel/database-excel.service';
import {BranchService, ItemService} from '@wizardcoder/bl-connect';
import {Branch, Item} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-item-upload',
	templateUrl: './item-upload.component.html',
	styleUrls: ['./item-upload.component.scss']
})
export class ItemUploadComponent implements OnInit {

	constructor(private _databaseExcelService: DatabaseExcelService, private _itemService: ItemService) {

	}

	ngOnInit() {

		this._itemService.get().then((items: Item[]) => {
			this._databaseExcelService.objectsToExcelFile(items, 'testItems.xlsx');
		}).catch((err) => {
			console.log('could not get the items', err);
		});


		console.log(this._databaseExcelService.excelFileToObjects({
			title: 'Signatur 3',
			'info.isbn': '123',
			'info.weight': 100,
			desc: 'hello there'
		}));


	}

}
