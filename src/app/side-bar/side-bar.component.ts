import {Component, OnInit} from '@angular/core';
import {UserDetail} from '@wizardcoder/bl-model';
import {CustomerDetailService} from '../customer/customer-detail/customer-detail.service';

@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
	public customerDetail: UserDetail;

	constructor(private _customerDetailService: CustomerDetailService) {
	}

	ngOnInit() {
		this.customerDetail = this._customerDetailService.getCustomerDetail();

		this._customerDetailService.onCustomerDetailChange().subscribe(() => {
			this.customerDetail = this._customerDetailService.getCustomerDetail();
		});
	}

}
