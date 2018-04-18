import {Component, OnInit} from '@angular/core';
import {CustomerDetailService} from '../../../customer/customer-detail/customer-detail.service';
import {BlApiError, Order, UserDetail} from '@wizardcoder/bl-model';
import {OrderService} from '@wizardcoder/bl-connect';

@Component({
	selector: 'app-customer-order-list',
	templateUrl: './customer-order-list.component.html',
	styleUrls: ['./customer-order-list.component.scss']
})
export class CustomerOrderListComponent implements OnInit {
	public customerDetail: UserDetail;
	public customerOrders: Order[];
	public wait: boolean;
	public warningText: string;

	constructor(private _customerDetailService: CustomerDetailService, private _orderService: OrderService) {
		this.wait = false;
		this.warningText = null;
	}

	ngOnInit() {
		this.customerDetail = this._customerDetailService.getCustomerDetail();

		if (this.customerDetail) {
			this.fetchCustomerOrders();
		}

		this._customerDetailService.onCustomerDetailChange().subscribe(() => {
			this.customerDetail = this._customerDetailService.getCustomerDetail();
			this.fetchCustomerOrders();
		});
	}

	fetchCustomerOrders() {
		this.wait = true;
		this.warningText = '';
		this._orderService.getManyByIds(this.customerDetail.orders).then((orders: Order[]) => {
			console.log('we got the orders', orders);
			if (orders.length <= 0) {
				this.warningText = 'no orders found';
			}
			this.customerOrders = orders;
			this.wait = false;
		}).catch((blApiError: BlApiError) => {
			console.log('customerOrderListComponent: could not fetch customer orders');
			this.wait = false;
			this.warningText = 'no orders found';
		});
	}

}
