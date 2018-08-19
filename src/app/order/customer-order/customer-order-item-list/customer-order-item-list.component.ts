import {Component, OnInit} from '@angular/core';
import {CustomerDetailService} from '../../../customer/customer-detail/customer-detail.service';
import {OrderService} from '@wizardcoder/bl-connect';
import {Item, Order, OrderItem, UserDetail} from '@wizardcoder/bl-model';
import {CustomerService} from '../../../customer/customer.service';
import {BranchStoreService} from '../../../branch/branch-store.service';
import {CustomerOrderItemListService} from './customer-order-item-list.service';

@Component({
	selector: 'app-customer-order-item-list',
	templateUrl: './customer-order-item-list.component.html',
	styleUrls: ['./customer-order-item-list.component.scss']
})
export class CustomerOrderItemListComponent implements OnInit {
	public customerDetail: UserDetail;
	public customerOrderItems: { orderItem: OrderItem, order: Order, item: Item}[];
	public noOrderItemsText: string;
	public currentBranchId: string;
	public wait: boolean;

	constructor(private _customerService: CustomerService,
	            private _branchStoreService: BranchStoreService,
	            private _customerOrderItemListService: CustomerOrderItemListService,
	            private _orderService: OrderService) {
		this.customerOrderItems = [];
		this.noOrderItemsText = 'Customer has no ordered items';
	}

	ngOnInit() {
		this.currentBranchId = this._branchStoreService.getCurrentBranch().id;

		if (this._customerService.haveCustomer()) {
			this.customerDetail = this._customerService.get().detail;
		}

		this.customerOrderItems = this._customerOrderItemListService.getCustomerOrderItems();

		this._customerOrderItemListService.onWait().subscribe((wait: boolean) => {
			this.wait = wait;
		});

		this._branchStoreService.onBranchChange().subscribe(() => {
			this.currentBranchId = this._branchStoreService.getCurrentBranch().id;
		});

		this._customerOrderItemListService.onCustomerOrderItemListChange().subscribe(() => {
			this.customerOrderItems = this._customerOrderItemListService.getCustomerOrderItems();
		});

		this._customerOrderItemListService.fetchOrderedItems().then((customerOrderItems) => {

			//this.customerOrderItems = customerOrderItems;
		}).catch(() => {

		});
	}

	public havePayed(customerOrderItem: { orderItem: OrderItem, order: Order }) {
		if (customerOrderItem.order.payments && customerOrderItem.order.payments.length > 0) {
			return true;
		}
		return false;
	}
}
