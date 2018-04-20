import {Component, OnInit} from '@angular/core';
import {CustomerDetailService} from "../../../customer/customer-detail/customer-detail.service";
import {OrderService} from "@wizardcoder/bl-connect";
import {Order, OrderItem, UserDetail} from "@wizardcoder/bl-model";

@Component({
	selector: 'app-customer-order-item-list',
	templateUrl: './customer-order-item-list.component.html',
	styleUrls: ['./customer-order-item-list.component.scss']
})
export class CustomerOrderItemListComponent implements OnInit {
	public customerDetail: UserDetail;
	public orderItems: OrderItem[];
	public customerOrderItems: {orderItem: OrderItem, order: Order}[];
	
	constructor(private _customerDetailService: CustomerDetailService, private _orderService: OrderService) {
		this.orderItems = [];
		this.customerOrderItems = [];
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
		this._orderService.getManyByIds(this.customerDetail.orders).then((orders: Order[]) => {
			
			for (const order of orders) {
				for (const orderItem of order.orderItems) {
					this.orderItems.push(orderItem);
					console.log('the orderItem', orderItem);
					this.customerOrderItems.push({orderItem: orderItem, order: order});
				}
			}
		}).catch(() => {
			console.log('customerOrderListComponent: could not get items');
		});
	}
	
	public havePayed(customerOrderItem: {orderItem: OrderItem, order: Order}) {
		if (customerOrderItem.order.payments && customerOrderItem.order.payments.length > 0) {
			return true;
		}
		return false;
	}
	
	
	
}
