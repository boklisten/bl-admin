import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Order} from '@wizardcoder/bl-model';
import {CustomerService} from '../customer/customer.service';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

	constructor(private _customerService: CustomerService) {
	}

	ngOnInit() {

		this._customerService.onCustomerChange().subscribe(() => {
			if (this._customerService.haveCustomer()) {
				console.log('we have a customer', this._customerService.get());
			} else {
				console.log('we dont have a customer');
			}
		});

		if (this._customerService.haveCustomer()) {
			console.log('we have a customer', this._customerService.get());
		} else {
			console.log('we dont have a customer');
		}
	}


}
