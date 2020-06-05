import { Injectable } from "@angular/core";
import { BlApiError, UserDetail } from "@wizardcoder/bl-model";
import { Subject, ReplaySubject, Subscription } from "rxjs";
import { UserDetailService } from "@wizardcoder/bl-connect";
import { StorageService } from "../../storage/storage.service";

@Injectable()
export class CustomerDetailService {
	private _currentCustomerDetail: UserDetail;
	private _customerDetail$: ReplaySubject<UserDetail>;
	private _userDetailIdStorageName: string;
	private _wait$: Subject<boolean>;

	constructor(
		private _userDetailService: UserDetailService,
		private _storageService: StorageService
	) {
		this._wait$ = new Subject();
		this._customerDetail$ = new ReplaySubject(1);
		this._userDetailIdStorageName = "bl-customer-id";
		this.getCustomerDetailIfInStorage();
	}

	public set(id: string) {
		this._wait$.next(true);
		this.getCustomerDetail(id)
			.then(userDetail => {
				this.setCustomerDetail(userDetail);
			})
			.catch(e => {
				console.log(e);
			});
	}

	public subscribe(func: (userDetail: UserDetail) => void): Subscription {
		return this._customerDetail$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	public clear() {
		this._wait$.next(false);
		this._storageService.remove(this._userDetailIdStorageName);
		this._customerDetail$.next(null);
	}

	public update(patchCustomerDetailObject: any): Promise<UserDetail> {
		return this._userDetailService
			.update(this._currentCustomerDetail.id, patchCustomerDetailObject)
			.then((customerDetail: UserDetail) => {
				this.setCustomerDetail(customerDetail);
				return this._currentCustomerDetail;
			})
			.catch((blApiError: BlApiError) => {
				throw new Error(
					"customerDetailService: could not update customerDetails: " +
						blApiError.msg
				);
			});
	}

	private saveIdToStorage(userDetailId: string) {
		this._storageService.store(this._userDetailIdStorageName, userDetailId);
	}

	private getCustomerDetailIfInStorage() {
		let customerDetailId: string;

		try {
			customerDetailId = this.getCustomerDetailIdFromStorage();
		} catch (e) {
			throw e;
		}

		return this.set(customerDetailId);
	}

	private getCustomerDetailIdFromStorage() {
		try {
			return this._storageService.get("bl-customer-id");
		} catch (e) {
			throw e;
		}
	}

	private async getCustomerDetail(id: string): Promise<UserDetail> {
		return this._userDetailService.getById(id);
	}

	private setCustomerDetail(customerDetail: UserDetail) {
		this._wait$.next(false);
		if (customerDetail) {
			this.saveIdToStorage(customerDetail.id);
			this._customerDetail$.next(customerDetail);
		} else {
			throw new Error("no customerDetail to set");
		}
	}
}
