import {Component, Input, OnInit} from '@angular/core';
import {Order} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-add-order-to-cart',
	templateUrl: './add-order-to-cart.component.html',
	styleUrls: ['./add-order-to-cart.component.scss']
})
export class AddOrderToCartComponent implements OnInit {
	@Input() order: Order;

	constructor() {
	}

	ngOnInit() {
	}

}
