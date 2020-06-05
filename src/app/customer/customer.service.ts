import { Injectable } from "@angular/core";
import { CustomerDetailService } from "./customer-detail/customer-detail.service";
import { Observable, Subject } from "rxjs";
import { Customer } from "./customer";
import { Order, UserDetail, CustomerItem } from "@wizardcoder/bl-model";
import { CustomerItemService } from "@wizardcoder/bl-connect";

@Injectable({ providedIn: "root" })
export class CustomerService {
	private _customerChange$: Subject<boolean>;
	private _customer: Customer;

	constructor(private _customerDetailService: CustomerDetailService) {
		this._customerChange$ = new Subject<boolean>();
		this._customer = null;
		this.handleCustomerDetailChange();
	}

	public get(): Customer {
		return this._customer;
	}

	public getCustomerDetail(): UserDetail {
		return this._customer ? this._customer.detail : null;
	}

	public haveCustomer(): boolean {
		return !!this._customer;
	}

	public reloadCustomer() {
		throw new Error("customerDetailService.reload() deprecated");
	}

	public isActiveCustomerItem(itemId: string): boolean {
		try {
			this.getActiveCustomerItem(itemId);
			return true;
		} catch (e) {}
		return false;
	}

	public getActiveCustomerItem(itemId: string): CustomerItem {
		for (let customerItem of this._customer.customerItems) {
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
	}

	public onCustomerChange(): Observable<boolean> {
		return this._customerChange$;
	}

	public clear() {
		this._customer = null;
		this._customerDetailService.clear();
	}

	private handleCustomerDetailChange() {
		this._customerDetailService.subscribe((customerDetail: UserDetail) => {
			this._customerChange$.next(true);
			this.setCustomer(customerDetail, null, null);
		});
	}

	private setCustomer(
		detail: UserDetail,
		orders?: Order[],
		customerItems?: CustomerItem[]
	) {
		this._customer = {
			detail: detail,
			orders: orders ? orders : null,
			customerItems: customerItems ? customerItems : null
		};

		this._customerChange$.next(true);
	}
}
