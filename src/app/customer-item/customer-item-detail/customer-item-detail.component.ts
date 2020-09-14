import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { CustomerItemService, ItemService } from "@wizardcoder/bl-connect";
import { CustomerItem, Item } from "@wizardcoder/bl-model";

@Component({
	selector: "app-customer-item-detail",
	templateUrl: "./customer-item-detail.component.html",
	styleUrls: ["./customer-item-detail.component.scss"]
})
export class CustomerItemDetailComponent implements OnInit {
	@Input() customerItem: CustomerItem;
	@Input() customerItemId: string;
	public item: Item;

	constructor(
		private _route: ActivatedRoute,
		private _customerItemService: CustomerItemService,
		private _itemService: ItemService
	) {}

	ngOnInit() {
		if (this.customerItem) {
			this.getItem();
		}

		if (this.customerItemId) {
			console.log("customerItemId", this.customerItemId);
			this.getCustomerItem(this.customerItemId);
		}

		/*
		this._route.params.subscribe((params: Params) => {
			if (params["id"]) {
				this.getCustomerItem(params["id"]);
			}
		});
       */
	}

	private getCustomerItem(id: string) {
		this._customerItemService
			.getById(id)
			.then((customerItem: CustomerItem) => {
				this.customerItem = customerItem;
				this.getItem();
			})
			.catch(getCustomerItemError => {
				console.log("hello there", this.getCustomerItem);
				console.log(
					"customerItemDetailComponent: could not get customerItem",
					getCustomerItemError
				);
			});
	}

	private getItem() {
		this._itemService
			.getById(this.customerItem.item as string)
			.then((item: Item) => {
				this.item = item;
			})
			.catch(getItemError => {
				console.log("customerItemDetailComponet: could not get item");
			});
	}
}
