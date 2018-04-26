import {Injectable} from '@angular/core';
import {OrderHandlerService} from '../../order/order-handler/order-handler.service';
import {Order} from '@wizardcoder/bl-model';

@Injectable()
export class CartConfirmService {

	constructor(private _orderHandlerService: OrderHandlerService) {
	}

	public confirm() {

	}

	public addOrder(): Promise<Order> {
		return this._orderHandlerService.addOrderFromCart();
	}

}
