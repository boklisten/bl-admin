import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CustomerService} from '../../customer.service';
import {UserDetail} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-customer-detail-small',
	templateUrl: './customer-detail-small.component.html',
	styleUrls: ['./customer-detail-small.component.scss']
})
export class CustomerDetailSmallComponent implements OnInit {
	public customerDetail: UserDetail;
	public customerValid: boolean;
	public customerNotValidText: string;

	@Output() valid: EventEmitter<boolean>;

	constructor(private _customerService: CustomerService) {
		this.customerValid = true;
		this.customerNotValidText = 'Customer is not valid';
		this.valid = new EventEmitter<boolean>();
	}

	ngOnInit() {
		this._customerService.onCustomerChange().subscribe(() => {
			this.setCustomerDetail(this._customerService.get().detail);
		});

		if (this._customerService.haveCustomer()) {
			this.setCustomerDetail(this._customerService.get().detail);
		}
	}

	private setCustomerDetail(customerDetail: UserDetail) {
		this.customerDetail = customerDetail;
		this.customerValid = this.checkIfCustomerIsValid(this.customerDetail);
		this.valid.emit(this.customerValid);
	}

	public onCustomerDetailUpdated() {
		this.customerDetail = this._customerService.get().detail;
		this.checkIfCustomerIsValid(this.customerDetail);
	}

	private checkIfCustomerIsValid(customerDetail: UserDetail) {
		if (!customerDetail.name) {
			return false;
		}

		if (!customerDetail.email) {
			return false;
		}

		if (!customerDetail.address) {
			return false;
		}

		if (!customerDetail.postCode) {
			return false;
		}

		if (!customerDetail.postCity) {
			return false;
		}

		if (!customerDetail.phone) {
			return false;
		}

		return true;
	}

}
