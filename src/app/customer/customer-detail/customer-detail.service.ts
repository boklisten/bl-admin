import { Injectable } from "@angular/core";
import { UserDetail } from "@boklisten/bl-model";
import { CustomerService } from "../customer.service";

@Injectable()
export class CustomerDetailService {
	private _customerDetail: UserDetail;

	constructor(private _customerService: CustomerService) {
		this.handleCustomerChange();
		this.handleCustomerClear();
	}

	public get(): UserDetail {
		if (!this._customerDetail) {
			throw new ReferenceError("customer detail is not set");
		}
		return this._customerDetail;
	}

	public getId(): string {
		try {
			let userDetail = this.get();
			return userDetail.id;
		} catch (e) {
			throw e;
		}
	}

	private handleCustomerChange() {
		this._customerService.subscribe((userDetail: UserDetail) => {
			this.setCustomerDetail(userDetail);
		});
	}

	private setCustomerDetail(customerDetail: UserDetail) {
		if (customerDetail) {
			this._customerDetail = customerDetail;
		} else {
			throw new Error("no customerDetail to set");
		}
	}

	private handleCustomerClear() {
		this._customerService.onClear(cleared => {
			if (cleared) {
				this.clear();
			}
		});
	}

	private clear() {
		this._customerDetail = null;
	}
}
