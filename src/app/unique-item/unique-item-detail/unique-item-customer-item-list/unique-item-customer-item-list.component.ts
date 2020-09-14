import { Component, OnInit, Input } from "@angular/core";
import { CustomerItem } from "@wizardcoder/bl-model";
import { CustomerItemService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-unique-item-customer-item-list",
	templateUrl: "./unique-item-customer-item-list.component.html",
	styleUrls: ["./unique-item-customer-item-list.component.scss"]
})
export class UniqueItemCustomerItemListComponent implements OnInit {
	@Input() blid: string;
	public customerItems: CustomerItem[];
	public wait: boolean;

	constructor(private _customerItemService: CustomerItemService) {}

	ngOnInit() {
		this.getCustomerItems(this.blid);
	}

	private getCustomerItems(blid: string) {
		this.wait = true;
		this._customerItemService
			.get({ query: "?blid=" + blid })
			.then(customerItems => {
				this.customerItems = customerItems;
				this.wait = false;
			})
			.catch(e => {
				this.customerItems = [];
				this.wait = false;
			});
	}
}
