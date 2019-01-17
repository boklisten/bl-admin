import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges
} from "@angular/core";
import { BlApiError, Delivery, Order, UserDetail } from "@wizardcoder/bl-model";
import { DeliveryService, UserDetailService } from "@wizardcoder/bl-connect";
import { CustomerService } from "../../../customer/customer.service";

@Component({
	selector: "app-order-delivery-detail",
	templateUrl: "./order-delivery-detail.component.html",
	styleUrls: ["./order-delivery-detail.component.scss"]
})
export class OrderDeliveryDetailComponent implements OnInit, OnChanges {
	@Input() order: Order;

	public delivery: Delivery;
	public notFoundText: string;
	public warningText: string;
	public wait: boolean;
	public customerDetail: UserDetail;

	constructor(
		private _deliveryService: DeliveryService,
		private _customerService: CustomerService,
		private _userDetailService: UserDetailService
	) {}

	ngOnInit() {
		this.customerDetail = this._customerService.getCustomerDetail();

		if (!this.customerDetail) {
			this.getCustomer(this.order.customer as string);
		}
	}

	getDelivery() {
		this.delivery = null;
		this.notFoundText = null;
		if (!this.order.delivery) {
			this.notFoundText = "Order has no delivery attached";
		} else {
			this.wait = true;
			this._deliveryService
				.getById(this.order.delivery as string)
				.then((delivery: Delivery) => {
					this.delivery = delivery;
					this.wait = false;
				})
				.catch((blApiError: BlApiError) => {
					this.warningText = "Could not get delivery";
					this.wait = false;
				});
		}
	}

	getCustomer(customerId: string) {
		this._userDetailService
			.getById(customerId)
			.then(customerDetail => {
				this.customerDetail = customerDetail;
			})
			.catch(() => {});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["order"].currentValue !== changes["order"].previousValue) {
			this.getDelivery();
		}
	}

	onBringClick() {
		window.open(
			"https://sporing.bring.no/sporing.html?q=" +
				this.delivery.info["trackingNumber"]
		);
	}
}
