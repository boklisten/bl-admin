import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CustomerItem, Item, UserDetail } from "@wizardcoder/bl-model";
import { CustomerItemListService } from "./customer-item-list.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-customer-item-list",
	templateUrl: "./customer-item-list.component.html",
	styleUrls: ["./customer-item-list.component.scss"]
})
export class CustomerItemListComponent implements OnInit, OnDestroy {
	@Input() title: string;
	public customerItemList: { customerItem: CustomerItem; item: Item }[];
	public wait: boolean;
	public error: boolean;
	public reminderDate: Date;
	private customerItemList$: Subscription;

	constructor(private _customerItemListService: CustomerItemListService) {
		this.customerItemList = [];
	}

	ngOnInit() {
		this.handleCustomerItemListChange();
	}

	ngOnDestroy() {
		this.customerItemList$.unsubscribe();
	}

	private handleCustomerItemListChange() {
		this.customerItemList$ = this._customerItemListService.subscribe(
			customerItemsWithItem => {
				this.customerItemList = customerItemsWithItem;
			}
		);
	}
}
