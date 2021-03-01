import { Injectable } from "@angular/core";
import { DatabaseExcelService } from "../database-excel.service";

@Injectable()
export class DatabaseExcelBranchService {
	constructor(private _databaseExcelService: DatabaseExcelService) {}
}
