import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BlApiError, UserDetail} from '@wizardcoder/bl-model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerDetailService} from '../../customer-detail.service';
import moment from 'moment-es6';

interface UserDetailPatch {
	[key: string]: any;
}

@Component({
	selector: 'app-customer-detail-modal-content',
	templateUrl: './customer-detail-modal-content.component.html',
	styleUrls: ['./customer-detail-modal-content.component.scss']
})
export class CustomerDetailModalContentComponent implements OnInit {
	public userDetailForm: FormGroup;
	public showContent = false;
	public dateInvalidError: boolean;
	public dateNotProvidedError: boolean;
	public wait: boolean;
	public dobInput: string;
	public dobOutput: Date;
	@Output() updated: EventEmitter<boolean>;

	constructor(public activeModal: NgbActiveModal, private _customerDetailService: CustomerDetailService) {
		this.showContent = false;
		this.updated = new EventEmitter<boolean>();
	}

	private _userDetail: UserDetail;

	get userDetail(): UserDetail {
		return this._userDetail;
	}

	@Input() set userDetail(userDetail: UserDetail) {
		this._userDetail = userDetail;
	}

	ngOnInit() {
		this.createUserDetailForm();
	}

	public onDobChange() {
		this.dateInvalidError = false;
		let momentDate = null;
		console.log('raw "' + this.dobInput + '"');

		momentDate = moment(this.dobInput.toString(), 'DD.MM.YYYY', true);

		if (momentDate.isValid()) {
			this.dateNotProvidedError = false;
			this.dobOutput = momentDate.toDate();
		} else {
			this.dateNotProvidedError = false;
			this.dateInvalidError = true;
		}
	}

	public onUserDetailUpdate() {
		const patchedValues = this.getPatchedValues();

		if (patchedValues !== {} && patchedValues !== null && Object.keys(patchedValues).length !== 0) {
			this.wait = true;
			this._customerDetailService.updateCustomerDetail(patchedValues).then((updatedUserDetail: UserDetail) => {
				this.updated.emit(true);
				this.activeModal.close('user details updated');
				this.wait = false;
			}).catch((blApiError: BlApiError) => {
				console.log('customerDetailModalContentComponent: could not update userDetail');
				this.wait = false;
			});
		} else {
			this.activeModal.close('no updates detected');
			this.wait = false;
		}
	}

	private createUserDetailForm() {
		this.userDetailForm = new FormGroup({
			'name': new FormControl(this.userDetail.name, [Validators.minLength(2)]),
			'phone': new FormControl(this.userDetail.phone, [Validators.minLength(8)]),
			'address': new FormControl(this.userDetail.address, []),
			'postCode': new FormControl(this.userDetail.postCode, [Validators.minLength(4)]),
			'postCity': new FormControl(this.userDetail.postCity),
			'country': new FormControl(this.userDetail.country),
		});

		console.log('userDetaildob', this.userDetail.dob);

		if (!this.userDetail.dob) {
			this.dateNotProvidedError = true;
		}

		this.dobInput = moment(this.userDetail.dob).format('DD.MM.YYYY');

		this.showContent = true;
	}

	private getPatchedValues(): any {
		this.dateNotProvidedError = false;
		const userDetailPatch: UserDetailPatch = {};

		for (const key of Object.keys(this.userDetailForm.controls)) {
			if (this.userDetailForm.controls[key].dirty) {
				userDetailPatch[key] = this.userDetailForm.controls[key].value;
			}
		}

		userDetailPatch['emailConfirmed'] = (this.userDetail.emailConfirmed) ? this.userDetail.emailConfirmed : false;
		userDetailPatch['dob'] = this.dobOutput;

		return userDetailPatch;
	}
}
