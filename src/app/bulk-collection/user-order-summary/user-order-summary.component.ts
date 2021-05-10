import { Component, Input, OnInit } from "@angular/core";
import { CustomerItemService } from "@boklisten/bl-connect";
import { ScannedBook } from "@boklisten/bl-model/dist/bulk-collection/bulk-collection";
import { BulkCollectionService } from "../bulk-collection.service";

@Component({
	selector: "app-user-order-summary",
	templateUrl: "./user-order-summary.component.html",
	styleUrls: ["./user-order-summary.component.scss"],
})
export class UserOrderSummaryComponent implements OnInit {
	@Input() userBooks: ScannedBook[];
	@Input() isHistory: boolean;
	public isCollapsed = true;
	public remainingBooks: ScannedBook[] = [];
	public hasFetchedRemainingBooks: boolean = false;

	constructor(
		private _customerItemService: CustomerItemService,
		private _bulkCollectionService: BulkCollectionService
	) {}

	async ngOnInit(): Promise<void> {
		await this.getRemainingBooks();
	}

	public async getRemainingBooks() {
		if (!this.isHistory && !this.hasFetchedRemainingBooks) {
			this.hasFetchedRemainingBooks = true;
			try {
				const customerItems = await this._customerItemService.get({
					query: `?customer=${this.userBooks[0].customerId}&returned=false`,
				});
				const requests = customerItems.filter(customerItem => customerItem.blid).map((customerItem) =>
					this._bulkCollectionService.createBookFromBlid(
						customerItem.blid
					)
				);
				this.remainingBooks = await Promise.all(requests);
			} catch (error) {}
		}
	}
}
