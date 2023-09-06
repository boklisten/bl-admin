import { Component, OnInit } from "@angular/core";
import { ToasterService } from "../toaster/toaster.service";
import { BulkCollectionService } from "./bulk-collection.service";
import { ScannedBook } from "@boklisten/bl-model/bulk-collection/bulk-collection";
import { CustomerItemService } from "@boklisten/bl-connect";
import moment from "moment";
import { Router } from "@angular/router";
import { BranchStoreService } from "../branch/branch-store.service";
import { Branch } from "@boklisten/bl-model";

@Component({
	selector: "app-bulk-collection",
	templateUrl: "./bulk-collection.component.html",
	styleUrls: ["./bulk-collection.component.scss"],
})
export class BulkCollectionComponent implements OnInit {
	public scannedBooks: Array<ScannedBook> = [];
	public showReceipt = false;
	public separatedBooks: Array<ScannedBook[]> = [];
	public customerRemainingBooksDict: Object = {};
	public waiting = false;
	public currentBranch: Branch;

	constructor(
		private _bulkCollectionService: BulkCollectionService,
		private _toasterService: ToasterService,
		private _customerItemService: CustomerItemService,
		private _branchStoreService: BranchStoreService,
		private router: Router
	) {}

	ngOnInit(): void {
		this._branchStoreService
			.onBranchChange()
			.subscribe((branch: Branch) => {
				this.currentBranch = branch;
			});
	}

	public deadlineHasPassed(deadline: string): boolean {
		return moment().isAfter(moment(deadline, "DD/MM/YYYY").add(1, "day"));
	}

	private hasExpiredDeadlines() {
		return this.scannedBooks.some((scannedBook) =>
			this.deadlineHasPassed(scannedBook.deadline)
		);
	}

	public async deliverBooks() {
		if (this.hasExpiredDeadlines()) {
			if (
				!confirm(
					"Noen av bøkene har utløpt frist! Er du sikker på at du vil levere?"
				)
			) {
				return;
			}
		}
		this.waiting = true;
		this.separatedBooks = this._bulkCollectionService.separateBooksByCustomer(
			this.scannedBooks
		);
		try {
			const completedOrders = await this._bulkCollectionService.collectOrders(
				this.separatedBooks
			);
			for (const scannedBook of this.scannedBooks) {
				scannedBook.collectedAt = this._bulkCollectionService.prettyTime(
					completedOrders[0].lastUpdated
				);
				scannedBook.orderId = completedOrders.find(
					(order) => order.customer === scannedBook.customerId
				)?.id;
			}

			const fetchRemainingBooks = completedOrders.map((order) =>
				this.getRemainingBooks(order.customer as string)
			);
			const customerRemainingBooks: Array<
				ScannedBook[]
			> = await Promise.all(fetchRemainingBooks);

			for (const remainingBooks of customerRemainingBooks) {
				if (remainingBooks?.length > 0) {
					this.customerRemainingBooksDict[
						remainingBooks[0].customerId
					] = remainingBooks;
				}
			}

			this.showReceipt = true;
			this._toasterService.add(
				"CHECKOUT-CONFIRMED",
				{
					numberOfItems: this.scannedBooks.length,
				},
				15000
			);
		} catch (error) {
			this._toasterService.add(
				"WARNING",
				{
					text:
						error.msg ??
						"Tilkoblingen ble brutt! Vennligst prøv igjen.",
				},
				15000
			);
			throw error;
		} finally {
			this.waiting = false;
		}
	}

	public reset() {
		this.showReceipt = false;
		this.waiting = false;
		this.scannedBooks = [];
		this.separatedBooks = [];
		this.customerRemainingBooksDict = {};
	}

	public async registerBlid(blid: string) {
		if (this.verifyBook(blid)) {
			const scannedBook = await this._bulkCollectionService.createBookFromBlid(
				blid
			);
			if (scannedBook && this.verifyBook(blid)) {
				this.scannedBooks.unshift(scannedBook);
			}
		} else {
			this._toasterService.add(
				"WARNING",
				{
					text: "Boken er allerede registrert.",
				},
				15000
			);
		}
	}

	private verifyBook(blid: string): boolean {
		return !this.scannedBooks.some((book) => book.blid === blid);
	}

	public removeBook(blid: string) {
		this.scannedBooks = this.scannedBooks.filter(
			(book) => book.blid !== blid
		);
	}

	public async getRemainingBooks(customerId: string) {
		try {
			const customerItems = await this._customerItemService.get({
				query: `?customer=${customerId}&returned=false&buyback=false&buyout=false&cancel=false`,
			});
			const requests = customerItems
				.filter((customerItem) => customerItem.blid)
				.map((customerItem) =>
					this._bulkCollectionService.createBookFromBlid(
						customerItem.blid
					)
				);
			return await Promise.all(requests);
		} catch (error) {}
	}

	warnBeforeRedirect(customerId: string) {
		if (
			confirm(
				"Er du sikker på at du vil gå til denne brukeren? Alle scannende bøker vil IKKE bli registrert."
			)
		) {
			this.router.navigate(["/customer/detail"], {
				queryParams: { customerId: customerId },
			});
		}
	}
}
