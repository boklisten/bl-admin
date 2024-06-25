import { Component, OnInit, Input } from "@angular/core";
import { PaymentDownloadService } from "./payment-download.service";
import { PaymentFilter } from "./paymentFilter";
import { ExcelService } from "../../excel/excel.service";

@Component({
	selector: "app-payment-download",
	templateUrl: "./payment-download.component.html",
	styleUrls: ["./payment-download.component.scss"],
})
export class PaymentDownloadComponent implements OnInit {
	public filter: PaymentFilter;
	public currentBranch: boolean;
	public noPaymentsFound: boolean;
	public wait: boolean;
	@Input() currentBranchId: string;

	constructor(
		private paymentDownloadService: PaymentDownloadService,
		private excelService: ExcelService
	) {
		this.filter = {
			branchIds: [],
			fromDate: new Date(),
			toDate: new Date(),
			methods: [],
		};

		this.noPaymentsFound = false;
		this.currentBranch = true;
	}

	ngOnInit() {}

	public onPeriodChange(period: { fromDate: Date; toDate: Date }) {
		this.filter.fromDate = period.fromDate;
		this.filter.toDate = period.toDate;
	}

	public onGetPayments() {
		this.noPaymentsFound = false;
		this.wait = true;

		if (this.currentBranch && typeof this.currentBranchId !== "undefined") {
			this.filter.branchIds = [this.currentBranchId];
		}

		this.paymentDownloadService
			.getPaymentsByFilter(this.filter)
			.then((payments) => {
				this.paymentDownloadService.printPaymentsToExcel(
					payments,
					"payments"
				);
				this.wait = false;
			})
			.catch(() => {
				this.noPaymentsFound = true;
				this.wait = false;
			});
	}
}
