import { Component, Input, OnInit } from "@angular/core";
import {
	BlApiError,
	CustomerItem,
	Item,
	UserDetail
} from "@wizardcoder/bl-model";
import {
	CustomerItemService,
	ItemService,
	MessageService
} from "@wizardcoder/bl-connect";
import { CartService } from "../../cart/cart.service";
import { CustomerService } from "../../customer/customer.service";
import { CustomerItemListService } from "./customer-item-list.service";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";

@Component({
	selector: "app-customer-item-list",
	templateUrl: "./customer-item-list.component.html",
	styleUrls: ["./customer-item-list.component.scss"]
})
export class CustomerItemListComponent implements OnInit {
	@Input() title: string;
	public customerDetail: UserDetail;
	public customerItemsWithItem: { customerItem: CustomerItem; item: Item }[];
	public wait: boolean;
	public error: boolean;
	public reminderDate: Date;

	constructor(
		private _customerItemListService: CustomerItemListService,
		private _customerService: CustomerService,
		private _customerDetailService: CustomerDetailService
	) {
		this.customerItemsWithItem = [];
	}

	ngOnInit() {
		if (this._customerService.haveCustomer()) {
			this.customerDetail = this._customerDetailService.get();
			this.getCustomerItems();
		}

		this._customerService.subscribe((userDetail: UserDetail) => {
			this.customerDetail = userDetail;
			this.getCustomerItems();
		});
		this.reminderDate = new Date(2018, 11, 20);
	}

	getCustomerItems() {
		this.wait = true;
		this.customerItemsWithItem = [];
		this._customerItemListService
			.getCustomerItems()
			.then(customerItemsWithItem => {
				this.customerItemsWithItem = customerItemsWithItem;
				this.wait = false;
			})
			.catch(err => {
				this.wait = false;
				this.error = true;
				console.log("customerItemList: could not get customer items");
			});
	}
}
