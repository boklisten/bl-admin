import {Component, OnInit} from '@angular/core';
import {Branch} from '@boklisten/bl-model';
import {DatabaseExcelService} from '../../database/database-excel/database-excel.service';

@Component({
	selector: 'app-branch-upload',
	templateUrl: './branch-upload.component.html',
	styleUrls: ['./branch-upload.component.scss']
})
export class BranchUploadComponent implements OnInit {
	public uploadedBranches: Branch[];

	constructor(private _databaseExcelService: DatabaseExcelService) {
		this.uploadedBranches = [];
	}

	ngOnInit() {
	}

	onBranchUpload(files: FileList) {

		const file = files[0];

		const reader = new FileReader();

		reader.onload = (e: any) => {
			const data = e.target.result;
			this.uploadedBranches = this._databaseExcelService.excelFileToObjects(data);
			console.log('the uploaded branches', this.uploadedBranches);
		};

		reader.readAsArrayBuffer(file);

	}


}
