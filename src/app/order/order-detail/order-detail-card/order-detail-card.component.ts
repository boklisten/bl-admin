import {Component, Input, OnInit} from '@angular/core';
import {Order} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-order-detail-card',
	templateUrl: './order-detail-card.component.html',
	styleUrls: ['./order-detail-card.component.scss']
})
export class OrderDetailCardComponent implements OnInit {
	@Input() order: Order;

	constructor() {
	}

	ngOnInit() {
	}

}
