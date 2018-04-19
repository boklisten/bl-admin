import {Component, Input, OnInit} from '@angular/core';
import {OrderItem} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-order-item-detail-list',
	templateUrl: './order-item-detail-list.component.html',
	styleUrls: ['./order-item-detail-list.component.scss']
})
export class OrderItemDetailListComponent implements OnInit {
	@Input() orderItems: OrderItem[];

	constructor() {
	}

	ngOnInit() {
	}

}
