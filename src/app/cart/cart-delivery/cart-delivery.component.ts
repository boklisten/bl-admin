import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Delivery, Order, UserDetail } from "@boklisten/bl-model";
import { DeliveryService } from "@boklisten/bl-connect";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";
@Component({
	selector: "app-cart-delivery",
	templateUrl: "./cart-delivery.component.html",
	styleUrls: ["./cart-delivery.component.scss"],
})
export class CartDeliveryComponent implements OnInit {
	@Input() order: Order;
	@Input() originalDelivery: Delivery;
	@Output() deliveryConfirmed: EventEmitter<boolean>;
	delivery: Delivery;
	trackingNumber: string;
	canConfirmDelivery: boolean;
	customerDetail: UserDetail;

	constructor(
		private _deliveryService: DeliveryService,
		private customerDetailService: CustomerDetailService
	) {
		this.trackingNumber = "";
		this.deliveryConfirmed = new EventEmitter<boolean>();
		this.canConfirmDelivery = false;
		this.customerDetail = this.customerDetailService.get();
	}

	ngOnInit() {
		this.delivery = {
			id: "",
			method: "bring",
			order: this.order.id,
			amount: 0,
			viewableFor: [this.customerDetail.blid],
			info: {
				from: this.originalDelivery.info["from"],
				to: this.originalDelivery.info["to"],
				facilityAddress: this.originalDelivery.info["facilityAddress"],
				shipmentAddress: this.originalDelivery.info["shipmentAddress"],
				estimatedDelivery: null,
				branch: this.order.branch as string,
				trackingNumber: "",
			},
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
		this.delivery.info["trackingNumber"] = this.trackingNumber;
		this._deliveryService
			.add(this.delivery)
			.then((addedDelivery) => {
				this.deliveryConfirmed.emit(true);
			})
			.catch((err) => {
				console.log("could not add delivery");
			});
	}
}
