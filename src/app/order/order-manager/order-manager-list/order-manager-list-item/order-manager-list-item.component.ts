import {Component, Input, OnInit} from '@angular/core';
import {Delivery, Order, UserDetail} from '@wizardcoder/bl-model';
import {CustomerItemService, DeliveryService, UserDetailService} from '@wizardcoder/bl-connect';
import {CustomerService} from '../../../../customer/customer.service';

@Component({
	selector: 'app-order-manager-list-item',
	templateUrl: './order-manager-list-item.component.html',
	styleUrls: ['./order-manager-list-item.component.scss']
})
export class OrderManagerListItemComponent implements OnInit {
	@Input() order: Order;
	userDetail: UserDetail;
	handedOutAllItems: boolean;
	delivery: Delivery;
	haveDelivery: boolean;
	havePayed: boolean;

	constructor(private _deliveryService: DeliveryService, private _customerItemService: CustomerItemService, private _userDetailService: UserDetailService) {
	}

	ngOnInit() {
		this.handedOutAllItems = this.haveHandedOutAllItems();
		this.getCustomer();
		this.getDelivery();
		this.havePayed = this.checkIfPayed();
	}

	getCustomer() {
		this._userDetailService.getById(this.order.customer).then((userDetail: UserDetail) => {
			this.userDetail = userDetail;
		}).catch((err) => {
			console.log('could not get customer detail', err);
		});
	}

	getDelivery() {
		this._deliveryService.getById(this.order.delivery).then((delivery: Delivery) => {
			this.delivery = delivery;
			this.haveDelivery = (this.delivery.method === 'bring');
		}).catch((err) => {
			console.log('OrderManagerListItem: could not get delivery', err);
		});
	}

	haveHandedOutAllItems() {
		for (const orderItem of this.order.orderItems) {
			if (!orderItem.info || !orderItem.info.customerItem) {
				return false;
			}
		}
		return true;
	}

	checkIfPayed() {
		if (this.order.amount === 0) {
			return true;
		}

		if (this.order.payments.length > 0) {
			return true;
		}

		return false;

	}

}
