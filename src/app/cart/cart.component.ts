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
	public haveCustomer: boolean;

	constructor(private _customerService: CustomerService) {
		this.haveCustomer = false;
	}

	ngOnInit() {
		this.haveCustomer = this._customerService.haveCustomer();

		this._customerService.onCustomerChange().subscribe(() => {
				this.haveCustomer = this._customerService.haveCustomer();
		});


	}


}
