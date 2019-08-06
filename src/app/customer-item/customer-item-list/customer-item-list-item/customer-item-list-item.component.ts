import { Component, Input, OnInit } from "@angular/core";
import { BlError, CustomerItem, Item } from "@wizardcoder/bl-model";
import { ItemService } from "@wizardcoder/bl-connect";
import { DateService } from "../../../date/date.service";
import { AuthService } from "../../../auth/auth.service";

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
		private _itemService: ItemService,
		private _dateService: DateService,
		private _authService: AuthService
	) {}

	ngOnInit() {
		this.deadlineExpired = this._dateService.isDeadlineExpired(
			this.customerItem.deadline
		);
		this.showAddButton = this.shouldShowAddButton();
		this._itemService
			.getById(this.customerItem.item as string)
			.then((item: Item) => {
				this.item = item;
			})
			.catch((getItemError: BlError) => {
				console.log(
					"customerItemListItemComponent: could not get item",
					getItemError
				);
			});
	}

	private shouldShowAddButton() {
		if (this.deadlineExpired) {
			return this._authService.isAdmin();
		}
		return true;
	}
}
