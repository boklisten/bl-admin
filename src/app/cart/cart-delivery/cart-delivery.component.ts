import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Delivery, Order} from '@wizardcoder/bl-model';
import {DeliveryService} from '@wizardcoder/bl-connect';

@Component({
	selector: 'app-cart-delivery',
	templateUrl: './cart-delivery.component.html',
	styleUrls: ['./cart-delivery.component.scss']
})
export class CartDeliveryComponent implements OnInit {
	@Input() order: Order;
	@Input() originalDelivery: Delivery;
	@Output() deliveryConfirmed: EventEmitter<boolean>;
	delivery: Delivery;
	trackingNumber: string;
	canConfirmDelivery: boolean;

	constructor(private _deliveryService: DeliveryService) {
		this.trackingNumber = '';
		this.deliveryConfirmed = new EventEmitter<boolean>();
		this.canConfirmDelivery = false;
	}

	ngOnInit() {
		console.log('we have the order here', this.order);

		this.delivery = {
			id: '',
			method: 'bring',
			order: this.order.id,
			amount: 0,
			info: {
				from: this.originalDelivery.info['from'],
				to: this.originalDelivery.info['to'],
				facilityAddress: this.originalDelivery.info['facilityAddress'],
				shipmentAddress: this.originalDelivery.info['shipmentAddress'],
				estimatedDelivery: null,
				branch: this.order.branch,
				trackingNumber: ''
			}
		};
	}

	onTrackingNumberChange() {
		if (this.trackingNumber.length <= 0) {
			this.canConfirmDelivery = false;
		} else {
			this.canConfirmDelivery = true;
		}
	}

	onTrackingNumberConfirm() {
		this.delivery.info['trackingNumber'] = this.trackingNumber;
		this._deliveryService.add(this.delivery).then((addedDelivery) => {
			console.log('added delivery', addedDelivery);
			this.deliveryConfirmed.emit(true);
		}).catch((err) => {
			console.log('could not add delivery');
		});
	}

}
