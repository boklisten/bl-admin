import { Injectable } from "@angular/core";
import { BlApiError, UserDetail } from "@wizardcoder/bl-model";
import { Subject, Observable } from "rxjs";
import { UserDetailService } from "@wizardcoder/bl-connect";
import { StorageService } from "../../storage/storage.service";

@Injectable()
export class CustomerDetailService {
	private _customerDetailChange$: Subject<UserDetail>;
	private _currentCustomerDetail: UserDetail;
	private _storageCustomerIdName: string;

	constructor(
		private _userDetailService: UserDetailService,
		private _storageService: StorageService
	) {
		this._storageCustomerIdName = "bl-customer-id";
		this._customerDetailChange$ = new Subject<UserDetail>();

		if (this._storageService.get(this._storageCustomerIdName)) {
			this.fetchCustomerDetail(
				this._storageService.get(this._storageCustomerIdName)
			)
				.then((customerDetail: UserDetail) => {
					this.setCustomerDetail(customerDetail);
				})
				.catch(error => {
					console.log(
						"customerDetailService: could not get the saved customer",
						error
					);
				});
		}
	}

	public haveCustomerDetail(): boolean {
		return this.getCustomerDetail() ? true : false;
	}

	public reloadCustomerDetail() {
		if (!this._currentCustomerDetail) {
			return;
		}
		this._userDetailService
			.getById(this._currentCustomerDetail.id, { fresh: true })
			.then((customerDetail: UserDetail) => {
				this.setCustomerDetail(customerDetail);
			})
			.catch(fetchCustomerDetailError => {
				console.log(
					"customerDetailService: could not fetch customerDetail"
				);
			});
	}

	public getAndSetCustomerDetailById(id: string): Promise<UserDetail> {
		return new Promise((resolve, reject) => {
			this.fetchCustomerDetail(id).then((customerDetail: UserDetail) => {
				const obs = this.onCustomerDetailChange().subscribe(() => {
					obs.unsubscribe();
					resolve(customerDetail);
				});

				this.setCustomerDetail(customerDetail);
			});
		});
	}

	public fetchCustomerDetail(id: string): Promise<UserDetail> {
		return this._userDetailService
			.getById(id, { fresh: true })
			.then((customerDetail: UserDetail) => {
				this.setCustomerDetail(customerDetail);
				return customerDetail;
			})
			.catch((blApiError: BlApiError) => {
				throw new Error(
					"customerDetailService: could not fetch customerDetail"
				);
			});
	}

	public getCustomerDetail(): UserDetail {
		return this._currentCustomerDetail;
	}

	public updateCustomerDetail(
		patchCustomerDetailObject: any
	): Promise<UserDetail> {
		return this._userDetailService
			.update(this._currentCustomerDetail.id, patchCustomerDetailObject)
			.then((customerDetail: UserDetail) => {
				this.setCustomerDetail(customerDetail);
				return this._currentCustomerDetail;
			})
			.catch((blApiError: BlApiError) => {
				throw new Error(
					"customerDetailService: could not update customerDetails"
				);
			});
	}

	public onCustomerDetailChange(): Observable<UserDetail> {
		return this._customerDetailChange$;
	}

	public setCustomerDetail(customerDetail: UserDetail) {
		/*
		if (!this.checkForCustomerDetailDifference(customerDetail)) {
			return;
		}
		*/

		this._storageService.store(
			this._storageCustomerIdName,
			customerDetail.id
		);
		this._currentCustomerDetail = customerDetail;
		this._customerDetailChange$.next(this._currentCustomerDetail);
	}

	private checkForCustomerDetailDifference(customerDetail: UserDetail) {
		if (!this._currentCustomerDetail) {
			return true;
		}

		for (const key of Object.keys(customerDetail)) {
			if (
				!this._currentCustomerDetail[key] ||
				this._currentCustomerDetail[key] !== customerDetail[key]
			) {
				return true;
			}
		}

		return false;
	}

	public clearCustomerDetail() {
		this._currentCustomerDetail = null;
		this._storageService.remove(this._storageCustomerIdName);
		this._customerDetailChange$.next();
	}
}
