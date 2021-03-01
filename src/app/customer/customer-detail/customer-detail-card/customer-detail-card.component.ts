import { Component, Input, OnInit } from "@angular/core";
import { UserDetail } from "@boklisten/bl-model";

@Component({
	selector: "app-customer-detail-card",
	templateUrl: "./customer-detail-card.component.html",
	styleUrls: ["./customer-detail-card.component.scss"],
})
export class CustomerDetailCardComponent implements OnInit {
	@Input() customerDetail: UserDetail;
	@Input() wait: boolean;
	public customerDetailUpdated: boolean;
	public showGuardian: boolean;

	constructor() {
		this.customerDetailUpdated = false;
	}

	ngOnInit() {
		this.showGuardian =
			this.customerDetail.guardian &&
			this.customerDetail.guardian.name &&
			this.customerDetail.guardian.name.length > 0;
	}

	onCustomerDetailUpdated() {
		this.customerDetailUpdated = true;
		setTimeout(() => {
			this.customerDetailUpdated = false;
		}, 2500);
	}
}
