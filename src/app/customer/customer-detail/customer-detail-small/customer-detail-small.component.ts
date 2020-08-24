import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	OnDestroy
} from "@angular/core";
import { CustomerService } from "../../customer.service";
import { UserDetail } from "@wizardcoder/bl-model";
import { Subscription } from "rxjs";
import { CustomerDetailService } from "../customer-detail.service";

@Component({
	selector: "app-customer-detail-small",
	templateUrl: "./customer-detail-small.component.html",
	styleUrls: ["./customer-detail-small.component.scss"]
})
export class CustomerDetailSmallComponent implements OnInit, OnDestroy {
	public customerDetail: UserDetail;
	public customerValid: boolean;
	public customerNotValidText: string;
	private customerDetail$: Subscription;

	@Output() valid: EventEmitter<boolean>;

	constructor(
		private _customerService: CustomerService,
		private _customerDetailService: CustomerDetailService
	) {
		this.customerValid = true;
		this.customerNotValidText =
			"Customer details does not have all valid fields";
		this.valid = new EventEmitter<boolean>();
	}

	ngOnInit() {
		this.handleCustomerDetailChange();
		this.customerDetail = this._customerDetailService.get();
	}

	ngOnDestroy() {
		this.customerDetail$.unsubscribe();
	}

	private handleCustomerDetailChange() {
		this.customerDetail$ = this._customerService.subscribe(
			(userDetail: UserDetail) => {
				this.setCustomerDetail(userDetail);
			}
		);
	}

	private setCustomerDetail(customerDetail: UserDetail) {
		this.customerDetail = customerDetail;
		this.customerValid = this.checkIfCustomerIsValid(this.customerDetail);
		this.valid.emit(this.customerValid);
	}

	public onCustomerDetailUpdated() {}

	private checkIfCustomerIsValid(customerDetail: UserDetail) {
		if (!customerDetail.name) {
			return false;
		}

		if (!customerDetail.email) {
			return false;
		}

		if (!customerDetail.address) {
			return false;
		}

		if (!customerDetail.postCode) {
			return false;
		}

		if (!customerDetail.postCity) {
			return false;
		}

		if (!customerDetail.phone) {
			return false;
		}

		if (!customerDetail.dob) {
			return false;
		}

		if (!customerDetail.emailConfirmed) {
			return false;
		}

		return true;
	}
}
