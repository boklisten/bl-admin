import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CustomerItem, Item, UserDetail } from "@boklisten/bl-model";
import { CustomerItemListService } from "./customer-item-list.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-customer-item-list",
	templateUrl: "./customer-item-list.component.html",
	styleUrls: ["./customer-item-list.component.scss"],
})
export class CustomerItemListComponent implements OnInit, OnDestroy {
	@Input() title: string;
	public customerItemList: { customerItem: CustomerItem; item: Item }[];
	public wait: boolean;
	public error: boolean;
	public reminderDate: Date;
	private customerItemList$: Subscription;
	private customerItemListWait$: Subscription;

	constructor(private _customerItemListService: CustomerItemListService) {
		this.customerItemList = [];
	}

	ngOnInit() {
		this.handleCustomerItemListChange();
		this.handleCustomerItemListWaitChange();
	}

	ngOnDestroy() {
		this.customerItemList$.unsubscribe();
		this.customerItemListWait$.unsubscribe();
	}

	private handleCustomerItemListChange() {
		this.customerItemList$ = this._customerItemListService.subscribe(
			(customerItemsWithItem) => {
				this.customerItemList = customerItemsWithItem;
			}
		);
	}

	private handleCustomerItemListWaitChange() {
		this.customerItemListWait$ = this._customerItemListService.onWait(
			(wait) => {
				this.wait = wait;
			}
		);
	}
}
