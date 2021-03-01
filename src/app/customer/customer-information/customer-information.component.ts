import { Component, OnInit, Input } from "@angular/core";
import { UserDetail } from "@boklisten/bl-model";
import { UserDetailService } from "@boklisten/bl-connect";

@Component({
	selector: "app-customer-information",
	templateUrl: "./customer-information.component.html",
	styleUrls: ["./customer-information.component.scss"],
})
export class CustomerInformationComponent implements OnInit {
	@Input() userDetail: UserDetail;
	@Input() userDetailId: string;

	constructor(private _userDetailService: UserDetailService) {}

	ngOnInit() {
		if (this.userDetailId) {
			this.getUserDetail(this.userDetailId);
		}
	}

	private getUserDetail(id: string) {
		this._userDetailService
			.getById(id)
			.then((userDetail) => {
				this.userDetail = userDetail;
			})
			.catch((err) => {});
	}
}
