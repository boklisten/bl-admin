import {Component, OnInit} from '@angular/core';
import {CustomerDetailService} from '../../../customer/customer-detail/customer-detail.service';
import {OrderService} from '@wizardcoder/bl-connect';
import {Order, OrderItem, UserDetail} from '@wizardcoder/bl-model';
import {CustomerService} from '../../../customer/customer.service';
import {BranchStoreService} from '../../../branch/branch-store.service';

@Component({
	selector: 'app-customer-order-item-list',
	templateUrl: './customer-order-item-list.component.html',
	styleUrls: ['./customer-order-item-list.component.scss']
})
export class CustomerOrderItemListComponent implements OnInit {
	public customerDetail: UserDetail;
	public customerOrderItems: { orderItem: OrderItem, order: Order }[];
	public noOrderItemsText: string;
	public currentBranchId: string;

	constructor(private _customerService: CustomerService,
	            private _branchStoreService: BranchStoreService,
	            private _orderService: OrderService) {
		this.customerOrderItems = [];
		this.noOrderItemsText = 'Customer has no ordered items';
	}

	ngOnInit() {
		this.currentBranchId = this._branchStoreService.getCurrentBranch().id;

		if (this._customerService.haveCustomer()) {
			this.customerDetail = this._customerService.get().detail;
			this.getOrderItems();
		}

		this._customerService.onCustomerChange().subscribe(() => {
			if (this._customerService.haveCustomer()) {
				this.customerDetail = this._customerService.get().detail;
				this.getOrderItems();
			} else {
				this.customerOrderItems = [];
			}
		});

		this._branchStoreService.onBranchChange().subscribe(() => {
			this.currentBranchId = this._branchStoreService.getCurrentBranch().id;
		});
	}

	private getOrderItems() {
		this.customerOrderItems = [];
		this._orderService.getManyByIds(this.customerDetail.orders).then((orders: Order[]) => {
			for (const order of orders) {
				for (const orderItem of order.orderItems) {
					this.addAsOrderedItem(order, orderItem);
				}
			}
		}).catch(() => {
			console.log('CustomerOrderItemList: could not get orders');
		});
	}

	public havePayed(customerOrderItem: { orderItem: OrderItem, order: Order }) {
		if (customerOrderItem.order.payments && customerOrderItem.order.payments.length > 0) {
			return true;
		}
		return false;
	}

	private addAsOrderedItem(order: Order, orderItem: OrderItem) {
		if (order.handoutByDelivery || !order.byCustomer) {
			return;
		}

		if (orderItem.handout) {
			return;
		}

		if (orderItem.movedToOrder) {
			return;
		}

		if (orderItem.type === 'rent' || orderItem.type === 'buy') {

			this.customerOrderItems.push({order: order, orderItem: orderItem});
		}

		return;

	}


}
