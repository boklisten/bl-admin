import {Component, OnInit} from '@angular/core';
import {Order} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-order-manager',
	templateUrl: './order-manager.component.html',
	styleUrls: ['./order-manager.component.scss']
})
export class OrderManagerComponent implements OnInit {
	activeOrder: Order;
	constructor() {
	}

	ngOnInit() {
	}

	onSelectOrder(order: Order) {
		this.activeOrder = order;
	}

}
