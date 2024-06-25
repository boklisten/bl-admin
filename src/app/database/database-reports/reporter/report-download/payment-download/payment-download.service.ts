import { Injectable } from "@angular/core";
import { PaymentService } from "@boklisten/bl-connect";
import { PaymentFilter } from "./paymentFilter";
import { Payment } from "@boklisten/bl-model";
import { ExcelService } from "../../excel/excel.service";
import moment from "moment-es6";

@Injectable({
	providedIn: "root",
})
export class PaymentDownloadService {
	constructor(
		private paymentService: PaymentService,
		private excelService: ExcelService
	) {}

	public async getPaymentsByFilter(
		filter: PaymentFilter
	): Promise<Payment[]> {
		try {
			const query = this.createQueryFromFilter(filter);
			const payments = await this.paymentService.get({ query: query });

			return payments;
		} catch (e) {
			throw new Error("no payments found by filter: " + e);
		}
	}

	public printPaymentsToExcel(
		payments: Payment[],
		fileName: string
	): boolean {
		const excelObjs = this.paymentsToExcelObjs(payments);
		this.excelService.objectsToExcelFile(excelObjs, fileName);
		return true;
	}

	private paymentsToExcelObjs(payments: Payment[]): any[] {
		const excelObjs = [];

		for (let payment of payments) {
			excelObjs.push(this.paymentToExcelObj(payment));
		}

		return excelObjs;
	}

	private paymentToExcelObj(payment: Payment): any {
		return {
			id: payment.id,
			orderId: payment.order,
			method: payment.method,
			amount: payment.amount,
			taxAmount: payment.taxAmount,
			customer: payment.customer,
			branchId: payment.branch,
			paymentId:
				payment.info && payment.info["paymentId"]
					? payment.info["paymentId"]
					: "",
			cofirmed: payment.confirmed,
			creationTime: payment.creationTime,
			pivot: 1, // used by excel to make pivot tables
		};
	}

	private createQueryFromFilter(filter: PaymentFilter): string {
		if (!filter) {
			return null;
		}

		let query = "?confirmed=true";

		if (typeof filter.branchIds !== "undefined") {
			query += this.addBranchIdQueryParams(filter.branchIds);
		}

		if (typeof filter.methods !== "undefined") {
			query += this.addMethodQueryParams(filter.methods);
		}

		query += this.addDateQueryParams(filter.fromDate, filter.toDate);

		return query;
	}

	private addDateQueryParams(fromDate: Date, toDate: Date): string {
		let query = "";

		const dateFormat = "DDMMYYYYHHmm";

		if (typeof fromDate !== "undefined") {
			const fromDateString = moment(fromDate).format(dateFormat);

			query += `&creationTime=>${fromDateString}`;
		}

		if (typeof toDate !== "undefined") {
			const toDateString = moment(toDate).format(dateFormat);

			query += `&creationTime=<${toDateString}`;
		}

		return query;
	}

	private addBranchIdQueryParams(branchIds: string[]): string {
		let query = "";

		for (const branchId of branchIds) {
			query += `&branch=${branchId}`;
		}

		return query;
	}

	private addMethodQueryParams(methods: string[]): string {
		let query = "";

		for (const method of methods) {
			query += `&method=${method}`;
		}

		return query;
	}
}
