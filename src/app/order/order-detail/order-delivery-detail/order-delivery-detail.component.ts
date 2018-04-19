import {Component, Input, OnInit} from '@angular/core';
import {BlApiError, Delivery, Order} from '@wizardcoder/bl-model';
import {DeliveryService} from '@wizardcoder/bl-connect';

@Component({
	selector: 'app-order-delivery-detail',
	templateUrl: './order-delivery-detail.component.html',
	styleUrls: ['./order-delivery-detail.component.scss']
})
export class OrderDeliveryDetailComponent implements OnInit {
	@Input() order: Order;

	public delivery: Delivery;
	public notFoundText: string;
	public warningText: string;
	public wait: boolean;

	constructor(private _deliveryService: DeliveryService) {

	}

	ngOnInit() {
		if (!this.order.delivery) {
			this.warningText = 'Order has no delivery attaced';
		} else {
			this.wait = true;
			this._deliveryService.getById(this.order.delivery).then((delivery: Delivery) => {
				this.delivery = delivery;
				this.wait = false;
			}).catch((blApiError: BlApiError) => {
				this.warningText = 'Could not get delivery';
				this.wait = false;
			});
		}
	}

}
