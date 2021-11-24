import { Component, OnInit } from "@angular/core";
import { Order } from "@boklisten/bl-model";
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
	public orders: Order[];
	public waiting = true;
	public isCollapsed = true;

	constructor(
		private _branchStoreService: BranchStoreService,
		private _databaseReportOrderService: DatabaseReportOrderService,
		private _bulkCollectionService: BulkCollectionService
	) {}

	ngOnInit(): void {}

	async createHistoryPreview() {
		this.isCollapsed = !this.isCollapsed;
		if (this.history.length > 0) {
			return;
		}
		const isBuyback =
			this._branchStoreService.getCurrentBranch().paymentInfo
				.partlyPaymentPeriods.length > 0;

		const filter: DatabaseReportOrderFilter = {
			branchId: this._branchStoreService.getCurrentBranch().id,
			orderItemNotDelivered: false,
			fromDate: new Date(Date.now() - 86400000),
			byCustomer: false,
			toDate: new Date(Date.now() + 86400000),
			type: isBuyback ? "buyback" : "return",
		};

		try {
			this.orders = await this._databaseReportOrderService.getOrdersByFilter(
				filter
			);
			for (const order of this.orders) {
				let customerIndex = this.history.findIndex(
					(customerBooks) =>
						customerBooks[0].customerId === order.customer
				);
				for (const orderItem of order.orderItems) {
					if (!orderItem.customerItem || !orderItem.blid) {
						continue;
					}
					if (customerIndex === -1) {
						const customerItem = await this._bulkCollectionService.getCustomerItem(
							"",
							order.orderItems[0].customerItem as string
						);
						this.history.push([
							{
								customerId: order.customer as string,
								blid: orderItem.blid,
								title: "",
								customerName: customerItem.customerInfo.name,
								deadline: "",
								id: orderItem.customerItem as string,
								item: "",
								orderId: order.id,
							},
						]);
						customerIndex = this.history.length - 1;
					} else {
						this.history[customerIndex].push({
							customerId: order.customer as string,
							blid: orderItem.blid,
							title: "",
							customerName: "",
							deadline: "",
							id: orderItem.customerItem as string,
							item: "",
							orderId: order.id,
						});
					}
				}
			}
			this.history.sort((a, b) =>
				a[0].customerName > b[0].customerName ? 1 : -1
			);
		} catch (error) {
		} finally {
			this.waiting = false;
		}
	}

	async fetchCustomerHistory(customerId: string) {
		const customerIndex = this.history.findIndex(
			(customerBooks) => customerBooks[0].customerId === customerId
		);
		try {
			const requests = [];
			for (const customerBook of this.history[customerIndex]) {
				requests.push(
					this._bulkCollectionService.createBookFromBlid(
						customerBook.blid,
						customerBook.id
					)
				);
			}
			const customerHistory: ScannedBook[] = await Promise.all(requests);
			this.history[customerIndex] = customerHistory.map((book) => {
				book.orderId = this.history[customerIndex].find(
					(historyBook) => historyBook.id === book.id
				)?.orderId;
				return book;
			});
		} catch (error) {}
	}
}
