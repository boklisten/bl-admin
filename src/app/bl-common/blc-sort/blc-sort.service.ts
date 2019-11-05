import { Injectable } from "@angular/core";
import { BranchItemStoreService } from "../../branch/branch-item-store/branch-item-store.service";
import { CustomerService } from "../../customer/customer.service";

@Injectable({
	providedIn: "root"
})
export class BlcSortService {
	constructor(
		private branchItemStoreService: BranchItemStoreService,
		private customerService: CustomerService
	) {}

	public sortByField(list: any[], field: string): any[] {
		return list.sort((a: any, b: any) => {
			if (
				a &&
				a[field] &&
				typeof a[field] === "string" &&
				b &&
				b[field] &&
				typeof b[field] === "string"
			) {
				const fieldA = a[field].toLowerCase();
				const fieldB = b[field].toLowerCase();
				if (fieldA < fieldB) {
					return -1;
				} else if (fieldA > fieldB) {
					return 1;
				}
			}
			return 0;
		});
	}

	public sortItemsByRelevance(itemList: any[]): any[] {
		let orderedItems = [];
		let customerItems = [];
		let itemsAtBranch = [];
		let itemsNotAtBranch = [];

		for (let item of itemList) {
			if (this.customerService.isItemOrdered(item.id)) {
				orderedItems.push(item);
			} else if (this.customerService.isActiveCustomerItem(item.id)) {
				customerItems.push(item);
			} else {
				if (this.branchItemStoreService.isItemInBranchItems(item.id)) {
					itemsAtBranch.push(item);
				} else {
					itemsNotAtBranch.push(item);
				}
			}
		}

		return orderedItems.concat(
			customerItems,
			itemsAtBranch,
			itemsNotAtBranch
		);
	}
}
