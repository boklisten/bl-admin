import { Component, OnInit, Input } from "@angular/core";
import { Delivery } from "@wizardcoder/bl-model";
import { DeliveryService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-delivery-detail",
	templateUrl: "./delivery-detail.component.html",
	styleUrls: ["./delivery-detail.component.scss"]
})
export class DeliveryDetailComponent implements OnInit {
	@Input() deliveryId: string;
	delivery: Delivery;

	constructor(private _deliveryService: DeliveryService) {}

	ngOnInit() {
		this._deliveryService
			.getById(this.deliveryId as string)
			.then(delivery => {
				this.delivery = delivery;
			})
			.catch(error => {
				console.log("");
			});
	}
}
