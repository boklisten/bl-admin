import { Component, Input, OnInit } from "@angular/core";
import { CustomerItem, Item, UserDetail } from "@wizardcoder/bl-model";
import { CustomerItemListService } from "./customer-item-list.service";

@Component({
	selector: "app-customer-item-list",
	templateUrl: "./customer-item-list.component.html",
	styleUrls: ["./customer-item-list.component.scss"]
})
export class CustomerItemListComponent implements OnInit {
	@Input() title: string;
	public customerItemsWithItem: { customerItem: CustomerItem; item: Item }[];
	public wait: boolean;
	public error: boolean;
	public reminderDate: Date;

	constructor(private _customerItemListService: CustomerItemListService) {
		this.customerItemsWithItem = [];
	}

	ngOnInit() {
		this.handleCustomerItemListChange();
	}

	private handleCustomerItemListChange() {
		this._customerItemListService.subscribe(customerItemsWithItem => {
			this.customerItemsWithItem = customerItemsWithItem;
		});
	}
}
