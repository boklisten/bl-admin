import { Component, OnInit } from "@angular/core";
import { CustomerDetailService } from "../customer-detail.service";
import { UserDetail } from "@boklisten/bl-model";

@Component({
	selector: "app-customer-detail-popover",
	templateUrl: "./customer-detail-popover.component.html",
	styleUrls: ["./customer-detail-popover.component.scss"]
})
export class CustomerDetailPopoverComponent implements OnInit {
	public customerDetail: UserDetail;

	constructor(private _customerDetailService: CustomerDetailService) {}

	ngOnInit() {
		this.customerDetail = this._customerDetailService.get();
	}
}
