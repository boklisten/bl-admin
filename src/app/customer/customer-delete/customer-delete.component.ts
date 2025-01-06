import {
	Component,
	OnInit,
	Input,
	ViewChild,
	Output,
	EventEmitter,
} from "@angular/core";
import { UserDetail } from "@boklisten/bl-model";
import { UserService } from "../../user/user.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TokenService, UserDetailService } from "@boklisten/bl-connect";
import { ToasterService } from "../../toaster/toaster.service";
import { environment } from "../../../environments/environment";

@Component({
	selector: "app-customer-delete",
	templateUrl: "./customer-delete.component.html",
	styleUrls: ["./customer-delete.component.scss"],
})
export class CustomerDeleteComponent implements OnInit {
	@Input() customer: UserDetail;
	@ViewChild("deleteCustomerModal") deleteCustomerModalContent: NgbModalRef;
	@Output() deleted: EventEmitter<boolean>;

	public isAdmin: boolean;
	public customerIdInput: string;
	public mergeIntoCustomerIdInput: string;
	public canConfirm: boolean;
	public showDeletionError: boolean;
	public wait: boolean;

	constructor(
		private _userService: UserService,
		private _modalService: NgbModal,
		private _userDetailService: UserDetailService,
		private _toasterService: ToasterService,
		private _tokenService: TokenService
	) {
		this.deleted = new EventEmitter();
	}

	ngOnInit() {
		this.isAdmin = this._userService.havePermission("admin");
	}

	private async blFetch<T>(
		path: string,
		method: string,
		body?: Record<string, unknown>,
		isRetry = false
	): Promise<T> {
		const headers = new Headers({ "Content-Type": "application/json" });
		if (this._tokenService.haveAccessToken()) {
			headers.set(
				"Authorization",
				"Bearer " + this._tokenService.getAccessToken()
			);
		}
		const request: RequestInit = {
			method,
			headers,
		};
		if (body) {
			request.body = JSON.stringify(body);
		}
		const response = await fetch(environment.apiPath + path, request);
		const data = await response.json();
		if (!response.ok) {
			throw data;
		}
		return data.data as T;
	}

	public onDelete() {
		this._modalService.open(this.deleteCustomerModalContent, {
			beforeDismiss: () => {
				this.customerIdInput = "";
				this.mergeIntoCustomerIdInput = "";
				this.canConfirm = false;
				this.showDeletionError = false;
				return true;
			},
		});
	}

	public onCustomerIdInputChange(input: string) {
		this.showDeletionError = false;
		this.canConfirm = input === this.customer.id;
	}

	public onConfirmDeletion() {
		this.wait = true;
		this.blFetch(
			`userdetails/${this.customerIdInput}`,
			"DELETE",
			(this.mergeIntoCustomerIdInput ?? "").length > 0
				? { mergeInto: this.mergeIntoCustomerIdInput }
				: null
		)
			.then(() => {
				this.wait = false;
				this._modalService.dismissAll();
				this.deleted.emit(true);
				this._toasterService.add("SUCCESS", "user was deleted");
			})
			.catch((error) => {
				this.showDeletionError = true;
				this.wait = false;
			});
	}
}
