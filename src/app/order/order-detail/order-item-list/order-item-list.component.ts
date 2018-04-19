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

	constructor(private _itemService: ItemService) {
	}

	ngOnInit() {
		for (let orderItem of this.order.orderItems) {
			console.log('the orderItem', orderItem);
		}
	}

}
