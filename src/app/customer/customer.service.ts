import {Injectable} from '@angular/core';
import {CustomerDetailService} from './customer-detail/customer-detail.service';
import {Observable, Subject} from 'rxjs';
import {Customer} from './customer';
import {CustomerOrderService} from '../order/customer-order/customer-order.service';
import {Order, OrderItem, UserDetail} from '@wizardcoder/bl-model';
import {CartService} from '../cart/cart.service';

@Injectable()
export class CustomerService {
	private _customerChange$: Subject<boolean>;
	private _customer: Customer;

	constructor(private _customerDetailService: CustomerDetailService, private _customerOrderService: CustomerOrderService) {
		this._customerChange$ = new Subject<boolean>();
		this._customer = null;

		this.handleCustomerDetailChange();
	}

	public get(): Customer {
		return this._customer;
	}

	public getCustomerDetail(): UserDetail {
		return (this._customer) ? this._customer.detail : null;
	}

	public haveCustomer(): boolean {
		return !(!this._customer);
	}

	public reloadCustomer() {
		this._customerDetailService.reloadCustomerDetail();
	}

	public haveOrderedItem(itemId: string): {orderItem: OrderItem, order: Order} {
		for (const order of this._customer.orders) {
			for (const orderItem of order.orderItems) {
				if (orderItem.item === itemId ) {
					if (orderItem.type === 'rent' || orderItem.type === 'buy') {
						return {orderItem: orderItem, order: order};
					}
				}
			}
		}

		throw new Error('customerService: did not have ordered item');
	}

	public onCustomerChange(): Observable<boolean> {
		return this._customerChange$;
	}

	public clear() {
		this._customer = null;
		this._customerDetailService.clearCustomerDetail();
	}

	private handleCustomerDetailChange() {
		this._customerDetailService.onCustomerDetailChange().subscribe(() => {
			const customerDetail = this._customerDetailService.getCustomerDetail();

			if (!customerDetail) {
				this._customer = null;
				this._customerChange$.next(true);
				return;
			}

			this.setCustomer(customerDetail);


				/*
			if (customerDetail.orders && customerDetail.orders.length > 0) {
				this._customerOrderService.getCustomerOrders().then((orders: Order[]) => {
					this.setCustomer(customerDetail, orders);
				}).catch(() => {
					console.log('customerService: could not get orders');
				});
			} else {
			}
				*/
		});
	}

	private setCustomer(detail: UserDetail, orders?: Order[]) {
		this._customer = {detail: detail, orders: (orders) ? orders : null};
		this._customerChange$.next(true);
	}
}
