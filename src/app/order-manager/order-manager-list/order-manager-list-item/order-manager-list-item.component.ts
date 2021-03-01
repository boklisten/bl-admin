import { Component, Input, OnInit } from "@angular/core";
import { Delivery, Order, UserDetail } from "@boklisten/bl-model";
import {
	CustomerItemService,
	DeliveryService,
	UserDetailService,
} from "@boklisten/bl-connect";
import { CustomerService } from "../../../customer/customer.service";

@Component({
	selector: "app-order-manager-list-item",
	templateUrl: "./order-manager-list-item.component.html",
	styleUrls: ["./order-manager-list-item.component.scss"],
})
export class OrderManagerListItemComponent implements OnInit {
	@Input() order: Order;
	userDetail: UserDetail;
	delivery: Delivery;
	haveDelivery: boolean;
	havePayed: boolean;

	constructor(
		private _deliveryService: DeliveryService,
		private _customerItemService: CustomerItemService,
		private _userDetailService: UserDetailService
	) {}

	ngOnInit() {
		this.getCustomer();
		this.getDelivery();
		this.havePayed = this.checkIfPayed();
	}

	getCustomer() {
		this._userDetailService
			.getById(this.order.customer as string)
			.then((userDetail: UserDetail) => {
				this.userDetail = userDetail;
			})
			.catch((err) => {
				console.log("could not get customer detail", err);
			});
	}

	getDelivery() {
		this._deliveryService
			.getById(this.order.delivery as string)
			.then((delivery: Delivery) => {
				this.delivery = delivery;
				this.haveDelivery = this.delivery.method === "bring";
			})
			.catch((err) => {
				console.log(
					"OrderManagerListItem: could not get delivery",
					err
				);
			});
	}

	checkIfPayed() {
		if (this.order.amount === 0) {
			return true;
		}

		if (this.order.payments.length > 0) {
			return true;
		}

		return false;
	}
}
