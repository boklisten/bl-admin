import {Injectable} from '@angular/core';
import {BlApiError, UserDetail} from '@wizardcoder/bl-model';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {UserDetailService} from '@wizardcoder/bl-connect';

@Injectable()
export class CustomerDetailService {

	private _customerDetailChange$: Subject<UserDetail>;
	private _currentCustomerDetail: UserDetail;

	constructor(private _userDetailService: UserDetailService) {
		this._customerDetailChange$ = new Subject<UserDetail>();
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
		this._currentCustomerDetail = customerDetail;
		this._customerDetailChange$.next(this._currentCustomerDetail);
	}

	public clearCustomerDetail() {
		this._currentCustomerDetail = null;
	}

}
