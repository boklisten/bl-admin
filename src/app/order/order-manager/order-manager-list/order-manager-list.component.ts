import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {OrderManagerListService} from './order-manager-list.service';
import {Order} from '@wizardcoder/bl-model';
import {BranchStoreService} from '../../../branch/branch-store.service';
import {CustomerService} from '../../../customer/customer.service';

@Component({
	selector: 'app-order-manager-list',
	templateUrl: './order-manager-list.component.html',
	styleUrls: ['./order-manager-list.component.scss']
})
export class OrderManagerListComponent implements OnInit {
	placedOrders: Order[];
	tempPlacedOrders: Order[];
	activeOrder: Order;
	allBranchesFilter: boolean;
	@Output() selectedOrder: EventEmitter<Order>;

	constructor(private _orderManagerListService: OrderManagerListService,
	            private _branchStoreService: BranchStoreService,
	            private _customerService: CustomerService) {
		this.selectedOrder = new EventEmitter<Order>();
		this.allBranchesFilter = false;
	}

	ngOnInit() {
		this._orderManagerListService.getPlacedOrders().then((orders: Order[]) => {
			this.placedOrders = orders;
			this.tempPlacedOrders = orders;
			this.filterOnlyCurrentBranch();
			this.filterNewestFirst();
		}).catch((err) => {
			console.log('could not get the placed orders', err);
		});

		this.onBranchChange();
	}

	onAllBranchesFilterClick() {
		this.allBranchesFilter = !this.allBranchesFilter;

		if (!this.allBranchesFilter) {
			this.filterOnlyCurrentBranch();
		} else {
			this.placedOrders = this.tempPlacedOrders;
		}
	}

	onBranchChange() {
		this._branchStoreService.onBranchChange().subscribe(() => {
			this.activeOrder = null;
			this.selectedOrder.emit(null);

			if (!this.allBranchesFilter) {
				this.filterOnlyCurrentBranch();
			}
		});
	}

	filterNewestFirst() {
		this.placedOrders = this.tempPlacedOrders.sort((orderA, orderB) => {
			return new Date(orderB.creationTime).getTime() - new Date(orderA.creationTime).getTime();
		});
	}

	filterOnlyCurrentBranch() {
		const branch = this._branchStoreService.getCurrentBranch();

		this.placedOrders = this.tempPlacedOrders.filter((order: Order) => {
			return (order.branch === branch.id);
		});
	}


	onOrderClick(order: Order) {
		this.activeOrder = order;
		this.selectedOrder.emit(order);
	}


}
