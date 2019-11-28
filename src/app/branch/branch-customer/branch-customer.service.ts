import { Injectable } from "@angular/core";
import { DateService } from "../../date/date.service";
import { CustomerItemService } from "@wizardcoder/bl-connect";
import { CustomerItem } from "@wizardcoder/bl-model";

@Injectable({
	providedIn: "root"
})
export class BranchCustomerService {
	constructor(
		private customerItemService: CustomerItemService,
		private dateService: DateService
	) {}

	public async getAllActiveCustomers(branch: string): Promise<string[]> {
		const fromDate = this.dateService.dateOnApiFormat(new Date());

		const customerItems = await this.customerItemService.get({
			query: `?deadline=>${fromDate}&returned=false&buyout=false&handoutInfo.handoutById=${branch}&og=customer`,
			fresh: true
		});

		return this.filterUniqueCustomerIds(customerItems);
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
