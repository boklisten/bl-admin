import {Injectable} from '@angular/core';
import {DatabaseReportOrderFilter} from './database-report-order-filter';
import {OrderService, UserDetailService} from '@wizardcoder/bl-connect';
import moment from 'moment-es6';
import {Order} from '@wizardcoder/bl-model';
import {DatabaseExcelService} from '../../database-excel/database-excel.service';

@Injectable({
	providedIn: 'root'
})
export class DatabaseReportOrderService {
	private _dateFormat: string;

	constructor(private _orderService: OrderService,
	            private _userDetailService: UserDetailService,
	            private _databaseExcelService: DatabaseExcelService) {
		this._dateFormat = 'DDMMYYYYHHmm';
	}

	public async printFilteredOrdersToFile(filter: DatabaseReportOrderFilter): Promise<boolean> {
		try {
			const orders = await this.getOrdersByFilter(filter);
			await this.printOrdersToExcel(orders, filter);

			return true;
		} catch (e) {
			throw e;
		}
	}

	public getOrdersByFilter(filter: DatabaseReportOrderFilter): Promise<Order[]> {
		const query = this.buildQuerySting(filter);
		return this._orderService.getAll(query);
	}

	private async printOrdersToExcel(orders: Order[], filter: DatabaseReportOrderFilter): Promise<boolean> {
		let allExcelObjects: any[] = [];

		for (const order of orders) {
			const excelObjects = await this.orderToExcelObjects(order, filter);
			allExcelObjects = allExcelObjects.concat(excelObjects);
		}


		this._databaseExcelService.objectsToExcelFile(allExcelObjects, 'orders.xlxs');

		return true;
	}

	private async orderToExcelObjects(order: Order, filter: DatabaseReportOrderFilter): Promise<any[]> {
		const excelObjects: any[] = [];

		for (const orderItem of order.orderItems) {
			if (filter.orderItemNotDelivered) {
				if (typeof orderItem.movedToOrder !== 'undefined') {
					continue;
				}
			}

			excelObjects.push({
				orderId: order.id,
				branchId: order.branch,
				orderMadeBy: (order.byCustomer) ? 'customer' : 'branch',
				customerId: order.customer,
				title: orderItem.title,
				amount: orderItem.amount,
				taxAmount: orderItem.taxAmount,
				type: orderItem.type,
				// handout: orderItem.handout,
				// delivered: orderItem.delivered,
				movedToOrder: orderItem.movedToOrder,
				creationTime: order.creationTime
			});
		}

		return excelObjects;
	}

	private buildQuerySting(filter: DatabaseReportOrderFilter): string {
		let query = '?placed=true';

		if (filter.branchId) {
			query += '&branch=' + filter.branchId;
		}

		if (filter.fromDate) {
			const fromDate = this.getDateString(filter.fromDate);

			if (filter.fromDate && filter.toDate) {
				const toDate = this.getDateString(filter.toDate);

				query += '&creationTime=>' + fromDate;
				query += '&creationTime=<' + toDate;
			} else {
				query += '&creationTime=' + fromDate;
			}
		}

		if (filter.byCustomer) {
			query += '&byCustomer=' + filter.byCustomer;
		}

		if (filter.orderItemNotDelivered) {
			query += '&orderItems.handout=' + !filter.orderItemNotDelivered;
		}

		return query;
	}

	private getDateString(date: Date): string {
		return moment(date).set('hours', 0).set('minutes', 0).format(this._dateFormat);
	}
}
