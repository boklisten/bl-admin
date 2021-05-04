import { Component, OnInit } from "@angular/core";
import { ToasterService } from "../toaster/toaster.service";
import { BulkCollectionService } from "./bulk-collection.service";
import { ScannedBook } from "@boklisten/bl-model/dist/bulk-collection/bulk-collection";

@Component({
	selector: "app-bulk-collection",
	templateUrl: "./bulk-collection.component.html",
	styleUrls: ["./bulk-collection.component.scss"],
})
export class BulkCollectionComponent implements OnInit {
	public scannedBooks: Array<ScannedBook> = [];
	public showReceipt: boolean = false;
	public separatedBooks: Array<ScannedBook[]> = [];
	public waiting: boolean = false;

	constructor(
		private _bulkCollectionService: BulkCollectionService,
		private _toasterService: ToasterService
	) {}

	ngOnInit(): void {}

	public async deliverBooks() {
		this.waiting = true;
		this.separatedBooks = this._bulkCollectionService.separateBooksByCustomer(
			this.scannedBooks
		);
		try {
			await this._bulkCollectionService.collectOrders(
				this.separatedBooks
			);
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
					text: "Tilkoblingen ble brutt! Vennligst prøv igjen.",
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
	}

	public async registerBlid(blid: string) {
		if (this.verifyBook(blid)) {
			const scannedBook = await this._bulkCollectionService.createBookFromBlid(
				blid
			);
			if (scannedBook && this.verifyBook(blid)) {
				this.scannedBooks.push(scannedBook);
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
}
