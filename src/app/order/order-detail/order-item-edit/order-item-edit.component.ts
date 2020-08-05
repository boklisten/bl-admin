import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { OrderItem } from "@wizardcoder/bl-model";
import { UserService } from "../../../user/user.service";

@Component({
	selector: "app-order-item-edit",
	templateUrl: "./order-item-edit.component.html",
	styleUrls: ["./order-item-edit.component.scss"]
})
export class OrderItemEditComponent implements OnInit {
	@Input() orderItem: OrderItem;
	@Output() shouldDelete: EventEmitter<boolean>;

	public isAdmin: boolean;
	public showConfirmDelete: boolean;

	constructor(private _userService: UserService) {
		this.shouldDelete = new EventEmitter();
	}

	ngOnInit() {
		this.isAdmin = this._userService.havePermission("admin");
	}

	public onDelete() {
		this.showConfirmDelete = true;
	}

	public onConfirmDelete() {
		this.shouldDelete.emit(true);
	}

	public onCancelDelete() {
		this.showConfirmDelete = false;
	}
}
