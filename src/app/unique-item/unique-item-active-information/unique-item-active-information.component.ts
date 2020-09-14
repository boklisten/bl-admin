import { Component, OnInit, Input } from "@angular/core";
import { UniqueItem, CustomerItem } from "@wizardcoder/bl-model";
import {
	UniqueItemService,
	CustomerItemService
} from "@wizardcoder/bl-connect";

@Component({
	selector: "app-unique-item-active-information",
	templateUrl: "./unique-item-active-information.component.html",
	styleUrls: ["./unique-item-active-information.component.scss"]
})
export class UniqueItemActiveInformationComponent implements OnInit {
	@Input() uniqueItem: UniqueItem;
	public activeCustomerItem: CustomerItem;

	constructor(
		private _uniqueItemService: UniqueItemService,
		private _customerItemService: CustomerItemService
	) {}

	ngOnInit() {
		this.getActiveCustomerItem();
	}

	public getActiveCustomerItem() {
		this._uniqueItemService
			.getWithOperation(this.uniqueItem.id, "active")
			.then(activeCustomerItem => {
				if (typeof activeCustomerItem == "string") {
					this.getCustomerItem(activeCustomerItem);
				}
			})
			.catch(e => {
				console.log("could not get active ");
			});
	}

	public getCustomerItem(customerItemId: string) {
		this._customerItemService
			.getById(customerItemId)
			.then(customerItem => {
				this.activeCustomerItem = customerItem;
			})
			.catch(e => {});
	}
}
