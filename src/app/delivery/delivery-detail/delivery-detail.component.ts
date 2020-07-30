import { Component, OnInit, Input } from "@angular/core";
import { Delivery } from "@wizardcoder/bl-model";
import { DeliveryService } from "@wizardcoder/bl-connect";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";

@Component({
	selector: "app-delivery-detail",
	templateUrl: "./delivery-detail.component.html",
	styleUrls: ["./delivery-detail.component.scss"]
})
export class DeliveryDetailComponent implements OnInit {
	//@Input() deliveryId: string;
	@Input() delivery: Delivery;
	public customerDetail: any;

	constructor(
		private _deliveryService: DeliveryService,
		private _customerDetailService: CustomerDetailService
	) {}

	ngOnInit() {
		this.customerDetail = this._customerDetailService.get();
		/*
		this._deliveryService
			.getById(this.deliveryId as string)
			.then(delivery => {
				this.delivery = delivery;
			})
			.catch(error => {
				console.log("could not get delivery", error);
			});
     */
	}
}
