import { Injectable } from "@angular/core";
import { Subject, ReplaySubject, Subscription } from "rxjs";
import { UserDetail, CustomerItem } from "@wizardcoder/bl-model";
import { UserDetailService, StorageService } from "@wizardcoder/bl-connect";
import { BlcHotkeyService } from "../bl-common/blc-hotkey/blc-hotkey.service";

@Injectable({ providedIn: "root" })
export class CustomerService {
	private _customerDetail$: ReplaySubject<UserDetail>;
	private _userDetailIdStorageName: string;
	private _clear$: Subject<boolean>;
	private _wait$: Subject<boolean>;
	private _customerDetail: UserDetail;

	constructor(
		private _userDetailService: UserDetailService,
		private _storageService: StorageService,
		private _blcHotkeyService: BlcHotkeyService
	) {
		this._customerDetail$ = new ReplaySubject(1);
		this._clear$ = new Subject<boolean>();
		this._wait$ = new Subject<boolean>();
		this._userDetailIdStorageName = "bl-customer-id";

		this.getCustomerDetailIfInStorage();
		this.handleAltRShortcut();
		this.handleAltDShortcut();
	}

	public subscribe(func: (userDetail: UserDetail) => void): Subscription {
		return this._customerDetail$.asObservable().subscribe(func);
	}

	private handleAltRShortcut() {
		this._blcHotkeyService.addShortcut({ keys: "alt.r" }).subscribe(() => {
			this.reload();
		});
	}

	private handleAltDShortcut() {
		this._blcHotkeyService.addShortcut({ keys: "alt.d" }).subscribe(() => {
			this.clear();
		});
	}

	public set(id: string): void {
		this._wait$.next(true);
		this.getCustomerDetail(id)
			.then((userDetail: UserDetail) => {
				this.setCustomerDetail(userDetail);
			})
			.catch(e => {
				this._wait$.next(false);
				console.log(e);
			});
	}

	public async setById(id: string): Promise<boolean> {
		this._wait$.next(true);
		const userDetail = await this.getCustomerDetail(id);
		this.setCustomerDetail(userDetail);
		this._wait$.next(false);
		return true;
	}

	public reload() {
		if (this._customerDetail) {
			this.set(this._customerDetail.id);
		}
	}

	public clear() {
		this._customerDetail = null;
		this._storageService.remove(this._userDetailIdStorageName);
		this._clear$.next(true);
	}

	public onClear(func: (cleared: boolean) => void): Subscription {
		return this._clear$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
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

	public getCustomerDetailId(): string {
		return this._customerDetail.id;
	}

	public getUserId(): string {
		return this._customerDetail.blid;
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

		this._wait$.next(false);
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
