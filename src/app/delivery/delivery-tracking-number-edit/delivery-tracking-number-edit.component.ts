import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Delivery, UserDetail } from "@boklisten/bl-model";
import { DeliveryService } from "@boklisten/bl-connect";
import { CustomerService } from "../../customer/customer.service";
import { BranchStoreService } from "../../branch/branch-store.service";

@Component({
	selector: "app-delivery-tracking-number-edit",
	templateUrl: "./delivery-tracking-number-edit.component.html",
	styleUrls: ["./delivery-tracking-number-edit.component.scss"]
})
export class DeliveryTrackingNumberEditComponent implements OnInit {
	@Input() delivery: Delivery;
	@Input() orderId: string;
	@Output() deliveryConfirmed: EventEmitter<Delivery>;
	public newDelivery: Delivery;
	public originalDelivery: Delivery;
	public trackingNumber: string;
	public canConfirmDelivery: boolean;

	constructor(
		private _deliveryService: DeliveryService,
		private _branchStoreService: BranchStoreService,
		private _customerService: CustomerService
	) {
		this.deliveryConfirmed = new EventEmitter<Delivery>();
	}

	ngOnInit() {
		this.originalDelivery = this.delivery;

		this.newDelivery = {
			id: "",
			method: "bring",
			order: this.orderId,
			amount: 0,
			viewableFor: [this._customerService.getUserId()],
			info: {
				from: this.originalDelivery.info["from"],
				to: this.originalDelivery.info["to"],
				facilityAddress: this.originalDelivery.info["facilityAddress"],
				shipmentAddress: this.originalDelivery.info["shipmentAddress"],
				estimatedDelivery: null,
				branch: this._branchStoreService.getBranchId(),
				trackingNumber: ""
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
		this.newDelivery.info["trackingNumber"] = this.trackingNumber;
		this.deliveryConfirmed.emit(this.newDelivery);
	}
}
