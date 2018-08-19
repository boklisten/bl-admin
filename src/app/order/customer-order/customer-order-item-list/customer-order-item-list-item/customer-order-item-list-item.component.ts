import {Component, Input, OnInit} from '@angular/core';
import {Delivery, Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {DeliveryService} from '@wizardcoder/bl-connect';
import {BranchStoreService} from '../../../../branch/branch-store.service';

@Component({
	selector: 'app-customer-order-item-list-item',
	templateUrl: './customer-order-item-list-item.component.html',
	styleUrls: ['./customer-order-item-list-item.component.scss']
})
export class CustomerOrderItemListItemComponent implements OnInit {
	@Input() customerOrderItem: {orderItem: OrderItem, order: Order, item: Item};
	public delivery: Delivery;
	public haveDelivery: boolean;
	public currentBranchId: string;

	constructor(private _deliveryService: DeliveryService, private _branchStoreService: BranchStoreService) {
	}

	ngOnInit() {
		this._deliveryService.getById(this.customerOrderItem.order.delivery).then((delivery) => {
			this.delivery = delivery;
			this.haveDelivery = (this.delivery.method === 'bring' && this.havePayed());
		}).catch(() => {
			console.log('CustomerOrderItemListItemComponent: could not get delivery');
		});

		this.currentBranchId = this._branchStoreService.getCurrentBranch().id;

		this._branchStoreService.onBranchChange().subscribe(() => {
			this.currentBranchId = this._branchStoreService.getCurrentBranch().id;
		});
	}

	public havePayed() {
		return (this.customerOrderItem.order.payments && this.customerOrderItem.order.payments.length > 0);
	}

}
