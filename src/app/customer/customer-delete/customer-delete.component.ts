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
import { UserDetailService } from "@boklisten/bl-connect";
import { ToasterService } from "../../toaster/toaster.service";

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
	public canConfirm: boolean;
	public showDeletionError: boolean;
	public wait: boolean;

	constructor(
		private _userService: UserService,
		private _modalService: NgbModal,
		private _userDetailService: UserDetailService,
		private _toasterService: ToasterService
	) {
		this.deleted = new EventEmitter();
	}

	ngOnInit() {
		this.isAdmin = this._userService.havePermission("admin");
	}

	public onDelete() {
		this._modalService.open(this.deleteCustomerModalContent, {
			beforeDismiss: () => {
				this.customerIdInput = "";
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
		this._userDetailService
			.remove(this.customer.id)
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
