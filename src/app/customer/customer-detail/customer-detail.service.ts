import {Injectable} from '@angular/core';
import {BlApiError, UserDetail} from '@wizardcoder/bl-model';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {UserDetailService} from '@wizardcoder/bl-connect';
import {StorageService} from "../../storage/storage.service";

@Injectable()
export class CustomerDetailService {

	private _customerDetailChange$: Subject<UserDetail>;
	private _currentCustomerDetail: UserDetail;
	private _storageCustomerIdName: string;

	constructor(private _userDetailService: UserDetailService, private _storageService: StorageService) {
		this._storageCustomerIdName = 'bl-customer-id';
		this._customerDetailChange$ = new Subject<UserDetail>();
		
		if (this._storageService.get(this._storageCustomerIdName)) {
			this.fetchCustomerDetail(this._storageService.get(this._storageCustomerIdName)).then(() => {
			
			}).catch((error) => {
				console.log('customerDetailService: could not get the saved customer', error);
			});
		}
	}

	public fetchCustomerDetail(id: string): Promise<UserDetail> {
		return this._userDetailService.getById(id).then((customerDetail: UserDetail) => {
			this.setCustomerDetail(customerDetail);
			return customerDetail;
		}).catch((blApiError: BlApiError) => {
			throw new Error('customerDetailService: could not fetch customerDetail');
		});
	}

	public getCustomerDetail(): UserDetail {
		return this._currentCustomerDetail;
	}

	public updateCustomerDetail(patchCustomerDetailObject: any): Promise<UserDetail> {
		return this._userDetailService
			.update(this._currentCustomerDetail.id, patchCustomerDetailObject).then((customerDetail: UserDetail) => {
				this.setCustomerDetail(customerDetail);
				return this._currentCustomerDetail;
		}).catch((blApiError: BlApiError) => {
			throw new Error('customerDetailService: could not update customerDetails');
		});
	}

	public onCustomerDetailChange(): Observable<UserDetail> {
		return this._customerDetailChange$;
	}

	public setCustomerDetail(customerDetail: UserDetail) {
		this._storageService.store(this._storageCustomerIdName, customerDetail.id);
		this._currentCustomerDetail = customerDetail;
		this._customerDetailChange$.next(this._currentCustomerDetail);
	}

	public clearCustomerDetail() {
		this._currentCustomerDetail = null;
	}

}
