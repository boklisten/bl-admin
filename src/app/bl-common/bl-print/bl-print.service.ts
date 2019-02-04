import { Injectable } from "@angular/core";
import { utils, WorkBook, write } from "xlsx";
import { saveAs } from "file-saver";

@Injectable({
	providedIn: "root"
})
export class BlPrintService {
	constructor() {}

  public printVismaRows(vismaRows: any[]) {
    const date = new Date();
    const title = date.getFullYear() + date.getHours() + '_visma_invoice' + '.csv';
		const workBook = this.makeWorkBook(title, vismaRows);
		this.printWorkBookToSemiColFile(workBook, title);
	}

	private printWorkBookToSemiColFile(wb: WorkBook, filename: string) {
		const wboutSemi = utils.sheet_to_csv(wb.Sheets[filename], { FS: ";" });
		this.printFile(wboutSemi, filename, "text/plain;charset=utf-8");
	}

	private printFile(file: any, fileName: string, type: string) {
		let blob = new Blob([file], { type: type });
		saveAs(blob, fileName);
	}

	private makeWorkBook(title: string, table: any) {
		let wb: WorkBook = { SheetNames: [], Sheets: {} };
		wb.SheetNames.push(title);
		let ws: any = utils.aoa_to_sheet(table);
		wb.Sheets[title] = ws;
		return wb;
	}
}
