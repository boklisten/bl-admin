import { Component, OnInit, Input } from "@angular/core";
import { ExcelService } from "../../excel/excel.service";
import { OrderDownloadService } from "./order-download.service";
import { DatabaseReportOrderFilter } from "./databaseReportOrderFilter";

@Component({
	selector: "app-order-download",
	templateUrl: "./order-download.component.html",
	styleUrls: ["./order-download.component.scss"],
})
export class OrderDownloadComponent implements OnInit {
	@Input() currentBranchId: string;
	public notDelivered: boolean;
	public fromDate: Date;
	public toDate: Date;
	public noOrdersFound: boolean;
	public byCustomer: boolean;
	public showFilter: boolean;
	public currentBranch: boolean;
	public wait: boolean;

	constructor(
		private _databaseReportOrderService: OrderDownloadService,
		private _databaseExcelService: ExcelService
	) {}

	ngOnInit() {
		this.noOrdersFound = false;
		this.notDelivered = false;
		this.fromDate = new Date(2001, 0, 0);
		this.toDate = new Date();
		this.showFilter = true;
		this.currentBranch = true;
		this.byCustomer = true;
		this.wait = false;
	}

	onPeriodChange(period: { fromDate: Date; toDate: Date }) {
		this.wait = false;
		this.noOrdersFound = false;
		this.fromDate = period.fromDate;
		this.toDate = period.toDate;
	}

	onShowFilter() {
		this.showFilter = !this.showFilter;
	}

	onGetOrders() {
		this.noOrdersFound = false;

		let branchId = "";

		if (this.currentBranch && typeof this.currentBranchId !== "undefined") {
			branchId = this.currentBranchId;
		}

		const filter: DatabaseReportOrderFilter = {
			branchId: branchId,
			orderItemNotHandedOut: this.notDelivered,
			fromDate: this.fromDate,
			byCustomer: this.byCustomer,
			toDate: this.toDate,
			includedOrderItemTypes: [
				"rent",
				"buy",
				"partly-payment",
				"sell",
				"return",
				"cancel",
				"buyback",
				"buyout",
				"extend",
			],
		};

		this.wait = true;

		this._databaseReportOrderService
			.printFilteredOrdersToFile(filter)
			.then(() => {
				this.wait = false;
			})
			.catch((err) => {
				this.noOrdersFound = true;
				this.wait = false;
			});
	}
}
