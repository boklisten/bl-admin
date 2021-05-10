import { Component, OnInit } from "@angular/core";
import { ScannedBook } from "@boklisten/bl-model/dist/bulk-collection/bulk-collection";
import { BranchStoreService } from "../../branch/branch-store.service";
import { DatabaseReportOrderFilter } from "../../database/database-reports/database-report-order/database-report-order-filter";
import { DatabaseReportOrderService } from "../../database/database-reports/database-report-order/database-report-order.service";
import { BulkCollectionService } from "../bulk-collection.service";

@Component({
	selector: "app-bulk-history",
	templateUrl: "./bulk-history.component.html",
	styleUrls: ["./bulk-history.component.scss"],
})
export class BulkHistoryComponent implements OnInit {
	public history: Array<ScannedBook[]> = [];
	public waiting: boolean;
	public isCollapsed = true;

	constructor(
		private _branchStoreService: BranchStoreService,
		private _databaseReportOrderService: DatabaseReportOrderService,
		private _bulkCollectionService: BulkCollectionService
	) {}

	ngOnInit(): void {}

	async getHistory() {
		if (this.history.length > 0) {
			return;
		}
		this.waiting = true;
		this.history = [];
		const filter: DatabaseReportOrderFilter = {
			branchId: this._branchStoreService.getCurrentBranch().id,
			orderItemNotDelivered: false,
			fromDate: new Date(Date.now() - 86400000),
			byCustomer: false,
			toDate: new Date(Date.now() + 86400000),
			type: "return",
		};

		try {
			const res = await this._databaseReportOrderService.getOrdersByFilter(
				filter
			);
			const requests = [];
			for (const orders of res) {
				for (const orderItem of orders.orderItems) {
					if (orderItem.customerItem && orderItem.blid) {
						requests.push(
							this._bulkCollectionService.createBookFromBlid(
								orderItem.blid,
								orderItem.customerItem as string
							)
						);
					}
				}
			}

			await Promise.all(requests).then((customerBooks) => {
				this.history = this._bulkCollectionService
					.separateBooksByCustomer(customerBooks)
					.sort((a: ScannedBook[], b: ScannedBook[]) =>
						a[0].customerName > b[0].customerName ? 1 : -1
					);
			});
		} catch (error) {
		} finally {
			this.waiting = false;
		}
	}
}
