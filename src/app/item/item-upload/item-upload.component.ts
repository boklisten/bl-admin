import { Component, OnInit } from "@angular/core";
import { DatabaseExcelService } from "../../database/database-excel/database-excel.service";
import { BranchService, ItemService } from "@boklisten/bl-connect";
import { Branch, Item } from "@boklisten/bl-model";

@Component({
	selector: "app-item-upload",
	templateUrl: "./item-upload.component.html",
	styleUrls: ["./item-upload.component.scss"],
})
export class ItemUploadComponent implements OnInit {
	private _file: File;
	public uploadedItems: Item[];

	constructor(
		private _databaseExcelService: DatabaseExcelService,
		private _itemService: ItemService
	) {
		this._file = null;
	}

	ngOnInit() {}

	onItemUpload(files: FileList) {
		const file = files[0];

		const reader = new FileReader();

		reader.onload = (e: any) => {
			const data = e.target.result;
			this.uploadedItems = this._databaseExcelService.excelFileToObjects(
				data
			);
		};

		reader.readAsArrayBuffer(file);
	}
}
