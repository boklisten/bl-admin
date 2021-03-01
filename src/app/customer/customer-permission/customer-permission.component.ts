import { Component, OnInit, Input } from "@angular/core";
import { UserDetail, UserPermission } from "@boklisten/bl-model";
import { CustomerService } from "../customer.service";

@Component({
	selector: "app-customer-permission",
	templateUrl: "./customer-permission.component.html",
	styleUrls: ["./customer-permission.component.scss"],
})
export class CustomerPermissionComponent implements OnInit {
	@Input() customer: UserDetail;
	public wait: boolean;
	public validPermissions: UserPermission[];
	public selectedPermission: UserPermission;

	constructor(private _customerService: CustomerService) {
		this.validPermissions = ["customer", "employee", "manager"];
	}

	ngOnInit() {
		this.getPermission();
	}

	public getPermission() {
		this._customerService
			.getPermission(this.customer.id)
			.then((permission) => {
				this.selectedPermission = permission;
			})
			.catch((e) => {});
	}

	public getIcon(permission) {
		switch (permission) {
			case "employee":
				return "user";
			case "manager":
				return "user-tie";
			case "admin":
				return "user-astronaut";
			case "super":
				return "user-secret";
		}
	}

	public changePermission(permission: UserPermission) {
		this.wait = true;
		this._customerService
			.setPermission(this.customer.id, permission)
			.then(() => {
				this.wait = false;
			})
			.catch((e) => {
				this.wait = false;
			});
	}
}
