import { Component, OnInit, Input } from "@angular/core";
import { CustomerItemFilter } from "./customerItemFilter";
import { CustomerItemService } from "@boklisten/bl-connect";
import { ExcelService } from "../../excel/excel.service";

@Component({
	selector: "app-customer-item-download",
	templateUrl: "./customer-item-download.component.html",
	styleUrls: ["./customer-item-download.component.scss"],
})
export class CustomerItemDownloadComponent implements OnInit {
	@Input() currentBranchId: string;
	public currentBranch: boolean;
	public customerItemFilter: CustomerItemFilter;
	public wait: boolean;
	public returned: boolean;
	public noCustomerItemsFound: boolean;
	public buyout: boolean;

	constructor(
		private customerItemService: CustomerItemService,
		private excelService: ExcelService
	) {
		this.wait = false;
		this.noCustomerItemsFound = false;
		this.returned = false;
		this.buyout = false;

		this.customerItemFilter = {
			fromDate: new Date(),
			toDate: new Date(),
		};
	}

	ngOnInit() {
		this.currentBranch = typeof this.currentBranchId !== "undefined";
	}

	public onPeriodChange(period: { fromDate: Date; toDate: Date }) {
		this.customerItemFilter.fromDate = period.fromDate;
		this.customerItemFilter.toDate = period.toDate;
	}

	public async onPrintCustomerItems() {
		const options = {
			returned: this.returned,
			buyout: this.buyout,
			createdAfter: this.customerItemFilter.fromDate,
			createdBefore: this.customerItemFilter.toDate,
		};
		if (this.currentBranch && typeof this.currentBranchId !== "undefined") {
			options["branchFilter"] = [this.currentBranchId];
		}
		this.wait = true;
		const data = await this.customerItemService.generateCustomerItemReport(
			options
		);
		this.wait = false;
		this.excelService.objectsToExcelFile(data, "customerItems");
	}
}
