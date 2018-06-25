import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Order} from '@wizardcoder/bl-model';
import {CustomerOrderService} from './customer-order.service';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class CustomerOrderResolverService implements Resolve<Order[]> {


	constructor(private _customerOrderService: CustomerOrderService) {

	}

	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order[]> {
		const customerOrderSub$ = new Subject<Order[]>();

		return Observable.create(this._customerOrderService.getCustomerOrders().then((orders: Order[]) => {
			return orders;
		}).catch((e) => {
			throw new Error('customerOrderResolver: could not get customer orders' + e);
		}));

	}
}
