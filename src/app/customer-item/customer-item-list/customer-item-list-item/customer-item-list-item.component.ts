import { Component, Input, OnInit } from "@angular/core";
import { CustomerItem, Item } from "@wizardcoder/bl-model";
import { DateService } from "../../../date/date.service";
import { AuthService } from "../../../auth/auth.service";
import { CustomerItemListService } from "../customer-item-list.service";

@Component({
	selector: "app-customer-item-list-item",
	templateUrl: "./customer-item-list-item.component.html",
	styleUrls: ["./customer-item-list-item.component.scss"]
})
export class CustomerItemListItemComponent implements OnInit {
	@Input() customerItem: CustomerItem;
	public item: Item;
	public deadlineExpired: boolean;
	public showAddButton: boolean;

	constructor(
		private _dateService: DateService,
		private _authService: AuthService,
		private _customerItemListService: CustomerItemListService
	) {}

	ngOnInit() {
		this.deadlineExpired = this._dateService.isDeadlineExpired(
			this.customerItem.deadline
		);

		this.showAddButton = this.shouldShowAddButton();

		const customerItemWithItem = this._customerItemListService.getByCustomerItemId(
			this.customerItem.id
		);
		this.item = customerItemWithItem.item;
	}

	private shouldShowAddButton() {
		if (this.deadlineExpired) {
			return this._authService.isAdmin();
		}
		return true;
	}
}
