import {Component, OnInit} from '@angular/core';
import {CustomerDetailService} from '../../../customer/customer-detail/customer-detail.service';
import {OrderService} from '@wizardcoder/bl-connect';
import {Order, OrderItem, UserDetail} from '@wizardcoder/bl-model';
import {CustomerService} from '../../../customer/customer.service';

@Component({
	selector: 'app-customer-order-item-list',
	templateUrl: './customer-order-item-list.component.html',
	styleUrls: ['./customer-order-item-list.component.scss']
})
export class CustomerOrderItemListComponent implements OnInit {
	public customerDetail: UserDetail;
	public customerOrderItems: { orderItem: OrderItem, order: Order }[];
	public noOrderItemsText: string;

	constructor(private _customerService: CustomerService) {
		this.customerOrderItems = [];
		this.noOrderItemsText = 'Customer has no ordered items';
	}

	ngOnInit() {

		if (this._customerService.haveCustomer()) {
			this.addCustomerOrder();
		}

		this._customerService.onCustomerChange().subscribe(() => {
			if (this._customerService.haveCustomer()) {
				this.addCustomerOrder();
			} else {
				this.customerOrderItems = [];
			}
		});
	}

	addCustomerOrder() {
		this.customerOrderItems = [];
		if (this._customerService.get().orders) {
			for (const order of this._customerService.get().orders) {
				for (const orderItem of order.orderItems) {
					if (orderItem.type !== 'buyout' && orderItem.type !== 'return' && !orderItem.info.customerItem
						&& (!orderItem.info || !orderItem.info.customerItem)) {
						this.customerOrderItems.push({orderItem: orderItem, order: order});
					}
				}
			}
		}
	}

	public havePayed(customerOrderItem: { orderItem: OrderItem, order: Order }) {
		if (customerOrderItem.order.payments && customerOrderItem.order.payments.length > 0) {
			return true;
		}
		return false;
	}


}