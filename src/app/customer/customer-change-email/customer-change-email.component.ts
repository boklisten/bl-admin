import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UserDetail } from "@boklisten/bl-model";
import { UserDetailService } from "@boklisten/bl-connect";
import { CustomerService } from "../customer.service";

@Component({
	selector: "app-customer-change-email",
	templateUrl: "./customer-change-email.component.html",
	styleUrls: ["./customer-change-email.component.scss"],
})
export class CustomerChangeEmailComponent implements OnInit {
	@Input() userDetail: UserDetail;
	@Output() changed: EventEmitter<boolean>;
	public email: string;
	public wait: boolean;
	public couldNotUpdateEmailError: boolean;

	constructor(
		private _userDetailService: UserDetailService,
		private _customerService: CustomerService
	) {
		this.changed = new EventEmitter();
	}

	ngOnInit() {
		this.email = this.userDetail.email;
		this.onCustomerChange();
	}

	private onCustomerChange() {
		this._customerService.subscribe((customerDetail: UserDetail) => {
			this.email = customerDetail.email;
		});
	}

	public changeEmail() {
		this.wait = true;
		this.couldNotUpdateEmailError = false;
		this._userDetailService
			.updateWithOperation(
				this.userDetail.id,
				{ email: this.email },
				"email"
			)
			.then(() => {
				this.wait = false;
				this.changed.emit(true);
			})
			.catch((e) => {
				this.couldNotUpdateEmailError = true;
				this.wait = false;
			});
	}
}
