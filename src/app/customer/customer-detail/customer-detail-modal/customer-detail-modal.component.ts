import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserDetail} from '@wizardcoder/bl-model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserDetailService} from '@wizardcoder/bl-connect';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerDetailModalContentComponent} from './customer-detail-modal-content/customer-detail-modal-content.component';

@Component({
	selector: 'app-customer-detail-modal',
	templateUrl: './customer-detail-modal.component.html',
	styleUrls: ['./customer-detail-modal.component.scss']
})
export class CustomerDetailModalComponent implements OnInit {

	public userDetailForm: FormGroup;

	@Input() userDetail: UserDetail;
	@Output() exit: EventEmitter<boolean>;

	constructor(private _modalService: NgbModal, private _userDetailService: UserDetailService) {
		this.exit = new EventEmitter<boolean>();
	}

	ngOnInit() {
	}

	public onShowModal() {
		setTimeout(() => {
			console.log('opening modal');
			const modalRef = this._modalService.open(CustomerDetailModalContentComponent);
			console.log('trying to add details');
			modalRef.componentInstance.userDetail = this.userDetail;
			console.log('added user detail');
		});
	}


}
