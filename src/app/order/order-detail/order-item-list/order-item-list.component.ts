import {Component, Input, OnInit} from '@angular/core';
import {Order} from '@wizardcoder/bl-model';
import {ItemService} from '@wizardcoder/bl-connect';

@Component({
	selector: 'app-order-item-list',
	templateUrl: './order-item-list.component.html',
	styleUrls: ['./order-item-list.component.scss']
})
export class OrderItemListComponent implements OnInit {
	@Input() order: Order;
	public warningText: string;
	public wait;

	constructor(private _itemService: ItemService) {
	}

	ngOnInit() {
		if (!this.order.orderItems || this.order.orderItems.length <= 0) {
			this.warningText = 'There was no items attached to the order';
		}
	}

	public calculateTotalAmount(): number {
		let totalAmount = 0;

		for (const orderItem of this.order.orderItems) {
			totalAmount += orderItem.amount;
		}

		return totalAmount;
	}

}
