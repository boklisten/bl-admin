import { Injectable } from "@angular/core";
import { Subject, ReplaySubject, Subscription } from "rxjs";
import { UserDetail, CustomerItem } from "@wizardcoder/bl-model";
import { UserDetailService, StorageService } from "@wizardcoder/bl-connect";

@Injectable({ providedIn: "root" })
export class CustomerService {
	private _customerDetail$: ReplaySubject<UserDetail>;
	private _userDetailIdStorageName: string;
	private _clear$: Subject<boolean>;
	private _customerDetail: UserDetail;

	constructor(
		private _userDetailService: UserDetailService,
		private _storageService: StorageService
	) {
		this._customerDetail$ = new ReplaySubject(1);
		this._clear$ = new Subject<boolean>();
		this._userDetailIdStorageName = "bl-customer-id";

		this.getCustomerDetailIfInStorage();
	}

	public subscribe(func: (userDetail: UserDetail) => void): Subscription {
		return this._customerDetail$.asObservable().subscribe(func);
	}

	public set(id: string): void {
		this.getCustomerDetail(id)
			.then((userDetail: UserDetail) => {
				this.setCustomerDetail(userDetail);
			})
			.catch(e => {
				console.log(e);
			});
	}

	public clear() {
		this._customerDetail = null;
		this._storageService.remove(this._userDetailIdStorageName);
		this._clear$.next(true);
	}

	public onClear(func: (cleared: boolean) => void): Subscription {
		return this._clear$.asObservable().subscribe(func);
	}

	public update(
		id: string,
		patchCustomerDetailObject: any
	): Promise<UserDetail> {
		return this._userDetailService
			.update(id, patchCustomerDetailObject)
			.then((customerDetail: UserDetail) => {
				this.setCustomerDetail(customerDetail);
				return customerDetail;
			})
			.catch((blApiError: any) => {
				throw new Error(
					"customerDetailService: could not update customerDetails: " +
						blApiError.msg
				);
			});
	}

	public haveCustomer(): boolean {
		return this._customerDetail ? true : false;
	}

	private getCustomerDetail(id: string): Promise<UserDetail> {
		return this._userDetailService.getById(id);
	}

	private setCustomerDetail(userDetail: UserDetail) {
		if (!userDetail) {
			throw new TypeError("customer detail is null or undefined");
		}

		this._customerDetail = userDetail;
		this._customerDetail$.next(userDetail);
		try {
			this._storageService.add(
				this._userDetailIdStorageName,
				userDetail.id
			);
		} catch (e) {
			throw e;
		}
	}

	private getCustomerDetailIfInStorage() {
		let customerDetailId: string;

		try {
			customerDetailId = this.getCustomerDetailIdFromStorage();
		} catch (e) {
			return;
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

	// ---------------------

	public isActiveCustomerItem(itemId: string): boolean {
		/*
		try {
			this.getActiveCustomerItem(itemId);
			return true;
		} catch (e) {}
		return false;
    */
		throw new Error("isActiveCustomerItem() is deprecated");
	}

	public getActiveCustomerItem(itemId: string): CustomerItem {
		/*
		for (let customerItem of this._customerDetail.customerItems) {
			if (customerItem.item === itemId) {
				if (
					!customerItem.returned &&
					!customerItem.buyout &&
					!customerItem.buyback
				)
					return customerItem;
			}
		}

		throw new Error("not found");
    */
		throw new Error("getActiveCustomerItem() is deprecated");
	}
}
