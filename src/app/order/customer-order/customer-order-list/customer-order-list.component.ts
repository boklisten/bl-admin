import {Component, OnInit} from '@angular/core';
import {CustomerDetailService} from '../../../customer/customer-detail/customer-detail.service';
import {BlApiError, Order, UserDetail} from '@wizardcoder/bl-model';
import {OrderService} from '@wizardcoder/bl-connect';
import {Router} from '@angular/router';

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

	constructor(private _customerDetailService: CustomerDetailService, private _orderService: OrderService, private _router: Router) {
		this.wait = false;
		this.warningText = null;
	}

	ngOnInit() {
		this.customerDetail = this._customerDetailService.getCustomerDetail();

		if (this.customerDetail) {
			this.fetchCustomerOrders();
		}
	}

	fetchCustomerOrders() {
		this.wait = true;
		this.warningText = '';
		this._orderService.getManyByIds(this.customerDetail.orders).then((orders: Order[]) => {
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

	onCustomerOrderDetailClick(id: string) {
		this._router.navigate(['order/' + id + '/detail']);
	}

}
