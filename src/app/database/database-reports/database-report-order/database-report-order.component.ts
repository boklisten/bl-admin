import {Component, OnInit} from '@angular/core';
import {DatabaseReportOrderService} from './database-report-order.service';
import {DatabaseReportOrderFilter} from './database-report-order-filter';
import {Order} from '@wizardcoder/bl-model';
import {DatabaseExcelService} from '../../database-excel/database-excel.service';
import {BranchService} from '@wizardcoder/bl-connect';
import {BranchStoreService} from '../../../branch/branch-store.service';

@Component({
	selector: 'app-database-report-order',
	templateUrl: './database-report-order.component.html',
	styleUrls: ['./database-report-order.component.scss']
})
export class DatabaseReportOrderComponent implements OnInit {
	public notDelivered: boolean;
	public fromDate: Date;
	public toDate: Date;
	public noOrdersFound: boolean;
	public showFilter: boolean;
	public currentBranch: boolean;
	public wait: boolean;

	constructor(private _databaseReportOrderService: DatabaseReportOrderService, private _branchStoreService: BranchStoreService, private _databaseExcelService: DatabaseExcelService) {
	}

	ngOnInit() {
		this.notDelivered = false;
		this.fromDate = new Date(2001, 0, 0);
		this.toDate = new Date();
		this.showFilter = true;
		this.currentBranch = true;
		this.wait = false;
	}

	onShowFilter() {
		this.showFilter = !this.showFilter;
	}

	onGetOrders() {
		this.noOrdersFound = false;
		const filter: DatabaseReportOrderFilter = {
			branchId: (this.currentBranch) ? this._branchStoreService.getCurrentBranch().id : null,
			orderItemNotDelivered: this.notDelivered,
			fromDate: this.fromDate,
			toDate: this.toDate
		};

		this.wait = true;
		this._databaseReportOrderService.printFilteredOrdersToFile(filter).then(() => {
			this.wait = false;
		}).catch((err) => {
			this.noOrdersFound = true;
			this.wait = false;
		});
	}
}
