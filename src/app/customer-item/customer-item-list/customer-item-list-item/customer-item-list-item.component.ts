import { Component, Input, OnInit } from "@angular/core";
import { BlError, CustomerItem, Item } from "@wizardcoder/bl-model";
import { ItemService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-customer-item-list-item",
	templateUrl: "./customer-item-list-item.component.html",
	styleUrls: ["./customer-item-list-item.component.scss"]
})
export class CustomerItemListItemComponent implements OnInit {
	@Input() customerItem: CustomerItem;
	public item: Item;

	constructor(private _itemService: ItemService) {}

	ngOnInit() {
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
}
