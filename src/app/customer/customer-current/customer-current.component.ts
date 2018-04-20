import {Component, HostListener, OnInit} from '@angular/core';
import {CustomerDetailService} from '../customer-detail/customer-detail.service';
import {UserDetail} from '@wizardcoder/bl-model';
import {Router} from '@angular/router';

@Component({
	selector: 'app-customer-current',
	templateUrl: './customer-current.component.html',
	styleUrls: ['./customer-current.component.scss']
})
export class CustomerCurrentComponent implements OnInit {
	public customerDetail: UserDetail;
	public lastPopoverRef: any;

	constructor(private _customerDetailService: CustomerDetailService, private _router: Router) {
		this._customerDetailService.onCustomerDetailChange().subscribe((customerDetail: UserDetail) => {
			this.customerDetail = customerDetail;
		});
	}

	ngOnInit() {

	}

	onViewCustomerDetail() {
		this._router.navigate(['/customer/' + this.customerDetail.id + '/detail']);
		this.lastPopoverRef.close();
	}

	onChangeCustomerDetail() {
		this._router.navigate(['/customer/search']);
		this.lastPopoverRef.close();
	}

	@HostListener('document:click', ['$event'])
	clickOutside(event) {
		// If there's a last element-reference AND the click-event target is outside this element
		if (this.lastPopoverRef && this.lastPopoverRef._elementRef) {
			if (!this.lastPopoverRef._elementRef.nativeElement.contains(event.target)) {
				this.lastPopoverRef.close();
				this.lastPopoverRef = null;
			}
		}
	}

	setCurrentPopoverOpen(popReference) {
		// If there's a last element-reference AND the new reference is different
		if (this.lastPopoverRef && this.lastPopoverRef !== popReference) {
			this.lastPopoverRef.close();
		}
		// Registering new popover ref
		this.lastPopoverRef = popReference;
	}


}