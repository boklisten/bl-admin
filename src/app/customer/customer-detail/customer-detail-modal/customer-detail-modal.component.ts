import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserDetail} from '@wizardcoder/bl-model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserDetailService} from '@wizardcoder/bl-connect';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerDetailModalContentComponent} from './customer-detail-modal-content/customer-detail-modal-content.component';
import {CustomerDetailService} from '../customer-detail.service';

@Component({
	selector: 'app-customer-detail-modal',
	templateUrl: './customer-detail-modal.component.html',
	styleUrls: ['./customer-detail-modal.component.scss']
})
export class CustomerDetailModalComponent implements OnInit {

	@Input() customerDetail: UserDetail;

	constructor(private _modalService: NgbModal) {
	}

	ngOnInit() {
	}

	public onShowModal() {
		setTimeout(() => {
			const modalRef = this._modalService.open(CustomerDetailModalContentComponent);
			modalRef.componentInstance.userDetail = this.customerDetail;
		});
	}



}