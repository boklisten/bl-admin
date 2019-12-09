import { Injectable } from "@angular/core";
import { DateService } from "../../date/date.service";
import {
	CustomerItemService,
	UserDetailService
} from "@wizardcoder/bl-connect";
import { CustomerItem } from "@wizardcoder/bl-model";

@Injectable({
	providedIn: "root"
})
export class BranchCustomerService {
	constructor(
		private customerItemService: CustomerItemService,
		private dateService: DateService,
		private userDetailService: UserDetailService
	) {}

	public async getAllActiveCustomers(branch: string): Promise<string[]> {
		const fromDate = this.dateService.dateOnApiFormat(new Date());

		const customerItems = await this.customerItemService.get({
			query: `?deadline=>${fromDate}&returned=false&buyout=false&handoutInfo.handoutById=${branch}&og=customer`,
			fresh: true
		});

		return this.filterUniqueCustomerIds(customerItems);
	}

	public async getAllCustomers(branch: string): Promise<string[]> {
		let userDetails = await this.userDetailService.get({
			query: "?og=_id&branch=" + branch,
			fresh: true
		});

		const customerIds = userDetails.map(userDetail => {
			return userDetail.id;
		});

		return customerIds;
	}

	private filterUniqueCustomerIds(customerItems: CustomerItem[]): string[] {
		const uniqueCustomerIds = [];

		for (const customerItem of customerItems) {
			if (uniqueCustomerIds.indexOf(customerItem.customer) < 0) {
				uniqueCustomerIds.push(customerItem.customer);
			}
		}
		return uniqueCustomerIds;
	}
}
