import { Injectable } from "@angular/core";
import { read, write, utils, WorkBook, writeFile } from "xlsx";
import { DateService } from "../../date/date.service";

@Injectable()
export class DatabaseExcelService {
	constructor(private _dateService: DateService) {}

	public objectsToExcelFile(objects: any[], fileName: string) {
		const flattenObjects = [];

		for (const obj of objects) {
			flattenObjects.push(this.flattenObj(obj));
		}

		const sheet = utils.json_to_sheet(flattenObjects);
		const workBook: WorkBook = utils.book_new();

		const fileNameWithDate =
			fileName + "_" + this._dateService.currentDateCompact() + ".xlsx";

		utils.book_append_sheet(workBook, sheet, fileNameWithDate);

		writeFile(workBook, fileNameWithDate);
	}

	public excelFileToObjects(excelBinaryFile: any): any[] {
		const workbook = read(excelBinaryFile, { type: "array" });

		const jsonWorkbook = utils.sheet_to_json(
			workbook.Sheets[workbook.SheetNames[0]],
			{ raw: true, range: 1 }
		);

		const objectArray = [];

		for (const obj of jsonWorkbook) {
			objectArray.push(this.flattenObjToRegular(obj));
		}

		return objectArray;
	}

	private flattenObjToRegular(flattenObj: any) {
		const regularObj = {};

		for (const objKey in flattenObj) {
			if (!flattenObj.hasOwnProperty(objKey)) {
				continue;
			}

			const splittedKey = objKey.toString().split(".");

			this.addFlattenObjToRegular(
				regularObj,
				splittedKey,
				flattenObj[objKey]
			);
		}

		return regularObj;
	}

	private addFlattenObjToRegular(parentObj: any, keys: string[], value: any) {
		const currentKey = keys[0];

		if (keys.length <= 1) {
			if (value === "false") {
				parentObj[keys[0]] = false;
			} else if (value === "true") {
				parentObj[keys[0]] = true;
			} else {
				parentObj[keys[0]] = value;
			}
			return;
		}

		if (!parentObj.hasOwnProperty(currentKey)) {
			parentObj[currentKey] = {};
		}

		keys.shift(); // removes the current key from array
		return this.addFlattenObjToRegular(parentObj[currentKey], keys, value);
	}

	private flattenObj(obj: any): any {
		const toReturn = {};
		let flatObject = {};

		for (const objKey in obj) {
			if (!obj.hasOwnProperty(objKey)) {
				continue;
			}

			if (typeof obj[objKey] === "object") {
				flatObject = this.flattenObj(obj[objKey]);

				for (const i in flatObject) {
					if (!flatObject.hasOwnProperty(i)) {
						continue;
					}

					toReturn[objKey + (!!isNaN(i as any) ? "." + i : "")] =
						flatObject[i];
				}
			} else {
				toReturn[objKey] = obj[objKey];
			}
		}
		return toReturn;
	}
}
