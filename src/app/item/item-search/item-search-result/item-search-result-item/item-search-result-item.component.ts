import { Component, OnInit, Input } from "@angular/core";
import { Item, CustomerItem, Period } from "@wizardcoder/bl-model";
import { BranchItemStoreService } from "../../../../branch/branch-item-store/branch-item-store.service";
import { CustomerService } from "../../../../customer/customer.service";
import { BranchStoreService } from "../../../../branch/branch-store.service";
import { BranchItemHelperService } from "../../../../branch/branch-item-helper/branch-item-helper.service";
import { CustomerOrderService } from "../../../../order/customer-order/customer-order.service";

@Component({
	selector: "app-item-search-result-item",
	templateUrl: "./item-search-result-item.component.html",
	styleUrls: ["./item-search-result-item.component.scss"]
})
export class ItemSearchResultItemComponent implements OnInit {
	@Input() item: Item;
	public customerItem: CustomerItem;

	constructor(
		private customerService: CustomerService,
		private branchItemStoreService: BranchItemStoreService,
		private branchStoreService: BranchStoreService,
		private branchItemHelperService: BranchItemHelperService,
		private customerOrderService: CustomerOrderService
	) {}

	ngOnInit() {
		try {
			this.customerItem = this.customerService.getActiveCustomerItem(
				this.item.id
			);
		} catch (e) {
			this.customerItem = null;
		}
	}

	public isItemOrdered(itemId: string): boolean {
		return this.customerOrderService.isItemOrdered(itemId);
	}

	public isActiveCustomerItem(itemId: string): boolean {
		try {
			this.customerService.getActiveCustomerItem(itemId);

			return true;
		} catch (e) {}
		return false;
	}

	public isItemValidOnBranch(itemId: string): boolean {
		return this.branchItemStoreService.isItemInBranchItems(itemId);
	}

	public isItemOrderedOnCorrectBranch(itemId: string): boolean {
		try {
			const {
				orderItem,
				order
			} = this.customerOrderService.getOrderedItem(itemId);

			return (
				(order.branch as string) ===
				this.branchStoreService.getBranchId()
			);
		} catch (e) {
			return true;
		}
	}

	public isRentValid(item: Item, periodType: Period): boolean {
		return this.branchItemHelperService.isRentValid(item, periodType);
	}

	public isBuyValid(item: Item) {
		return this.branchItemHelperService.isBuyValid(item);
	}

	public isSellValid(item: Item) {
		return this.branchItemHelperService.isSellValid(item);
	}
}
