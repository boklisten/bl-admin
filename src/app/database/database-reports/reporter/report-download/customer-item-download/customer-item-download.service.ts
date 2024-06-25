import { Injectable } from "@angular/core";
import { CustomerItemFilter } from "./customerItemFilter";
import { CustomerItemService } from "@boklisten/bl-connect";
import { CustomerItem } from "@boklisten/bl-model";
import { ExcelService } from "../../excel/excel.service";
import { DateService } from "../../../../../date/date.service";

@Injectable({
	providedIn: "root",
})
export class CustomerItemDownloadService {
	constructor(
		private customerItemService: CustomerItemService,
		private excelService: ExcelService,
		private dateService: DateService
	) {}

	public async getCustomerItemsByFilter(
		filter: CustomerItemFilter
	): Promise<CustomerItem[]> {
		return await this.customerItemService.get({
			query: this.createQueryByFilter(filter),
		});
	}

	public printCustomerItemsToExcelFile(
		customerItems: CustomerItem[],
		fileName: string
	): boolean {
		const excelObjs = this.customerItemsToExcelObjs(customerItems);
		this.excelService.objectsToExcelFile(excelObjs, fileName);
		return true;
	}

	private customerItemsToExcelObjs(customerItems: CustomerItem[]): any[] {
		const excelObjs = [];

		for (const customerItem of customerItems) {
			excelObjs.push(this.customerItemToExcelObj(customerItem));
		}

		return excelObjs;
	}

	private customerItemToExcelObj(customerItem: CustomerItem): any {
		let excelObj = {
			id: customerItem.id ? customerItem.id : null,
			type: customerItem.type ? customerItem.type : null,
			deadline: customerItem.deadline
				? this.dateService.convertToExcelDate(customerItem.deadline)
				: null,
			blid: customerItem.blid ?? null,

			handoutBranch:
				customerItem.handoutInfo &&
				customerItem.handoutInfo.handoutBy === "branch"
					? customerItem.handoutInfo.handoutById
					: null,
			handoutEmployee: customerItem.handoutInfo
				? customerItem.handoutInfo.handoutEmployee
				: null,
			handoutTime: customerItem.handoutInfo
				? this.dateService.convertToExcelDate(
						customerItem.handoutInfo.time
				  )
				: null,

			returned: customerItem.returned ? customerItem.returned : null,
			returnedToBranch:
				customerItem.returnInfo &&
				customerItem.returnInfo.returnedTo === "branch"
					? customerItem.returnInfo.returnedToId
					: null,
			returnTime: customerItem.returnInfo
				? this.dateService.convertToExcelDate(
						customerItem.returnInfo.time
				  )
				: null,
			returnedByEmployee: customerItem.returnInfo
				? customerItem.returnInfo.returnEmployee
				: null,

			buyout: customerItem.buyout ? customerItem.buyout : null,
			buyoutOrderId: customerItem.buyoutInfo
				? customerItem.buyoutInfo.order
				: null,
			buyoutTime: customerItem.buyoutInfo
				? customerItem.buyoutInfo.time
				: null,
		};

		excelObj = this.attachCustomerToExcelObj(excelObj, customerItem);
		excelObj = this.attachItemToEcelObj(excelObj, customerItem);

		excelObj["pivot"] = 1;

		return excelObj;
	}

	private attachItemToEcelObj(excelObj: any, customerItem: CustomerItem) {
		if (typeof customerItem["item"] !== "string") {
			const item = customerItem["item"];

			excelObj["item"] = {
				id: item["id"],
				title: item["title"],
				info: {
					isbn:
						item["info"] && item["info"]["isbn"]
							? item["info"]["isbn"].toString()
							: "",
				},
			};
		}

		return excelObj;
	}

	private attachCustomerToExcelObj(
		excelObj: any,
		customerItem: CustomerItem
	) {
		const customerObj = {
			id: "",
			name: "",
			email: "",
			phone: "",
		};

		if (typeof customerItem["customer"] !== "string") {
			const customer = customerItem["customer"];
			customerObj.id = customer["id"];
			customerObj.name = customer["name"];
			customerObj.email = customer["email"];
			customerObj.phone = customer["phone"];
		} else {
			customerObj.id = customerItem.customer
				? (customerItem.customer as string)
				: null;
			customerObj.name =
				customerItem["customerInfo"] &&
				customerItem["customerInfo"].name
					? customerItem["customerInfo"].name
					: null;
			customerObj.phone =
				customerItem["customerInfo"] &&
				customerItem["customerInfo"].phone
					? customerItem["customerInfo"].phone
					: null;
		}

		excelObj["customer"] = customerObj;

		return excelObj;
	}
	private createQueryByFilter(filter: CustomerItemFilter): string {
		let query = "?handout=true&expand=customer&expand=item";

		query += this.getBranchIdsQuery(filter.branchIds);
		query += this.getDateQuery(filter.fromDate, filter.toDate);
		query += this.getReturnedQuery(filter.returned);
		query += this.getBuyoutQuery(filter.buyout);

		return query;
	}

	private getBuyoutQuery(buyout: boolean): string {
		if (typeof buyout === "undefined") {
			return "";
		}

		return `&buyout=${buyout}`;
	}

	private getReturnedQuery(returned: boolean): string {
		if (typeof returned === "undefined") {
			return "";
		}

		return `&returned=${returned}`;
	}

	private getDateQuery(fromDate: Date, toDate: Date): string {
		if (typeof fromDate === "undefined" || typeof toDate === "undefined") {
			return "";
		}

		return this.dateService.getPeriodQuery(fromDate, toDate);
	}

	private getBranchIdsQuery(branchIds: string[]): string {
		if (typeof branchIds === "undefined") {
			return "";
		}

		let query = "";

		for (const branchId of branchIds) {
			query += `&handoutInfo.handoutById=${branchId}`;
		}

		return query;
	}
}
