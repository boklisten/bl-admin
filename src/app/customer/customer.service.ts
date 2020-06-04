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

	constructor(
		private _customerDetailService: CustomerDetailService,
		private _customerItemService: CustomerItemService
	) {
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
		this._customerDetailService.reloadCustomerDetail();
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
		this._customerDetailService.clearCustomerDetail();
	}

	private handleCustomerDetailChange() {
		this._customerDetailService
			.onCustomerDetailChange()
			.subscribe(async () => {
				const customerDetail = this._customerDetailService.getCustomerDetail();
				if (!customerDetail) {
					this._customer = null;
					this._customerChange$.next(true);
					return;
				}

				let customerItems;

				try {
					customerItems = await this._customerItemService.get({
						query: `?customer=${customerDetail.id}`
					});
				} catch (e) {
					this._customer = null;
					this._customerChange$.next(true);
				}

				this.setCustomer(customerDetail, null, customerItems);
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
