import { Component, Input, OnInit } from "@angular/core";
import { ItemService } from "@boklisten/bl-connect";
import { ScannedBook } from "@boklisten/bl-model/dist/bulk-collection/bulk-collection";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-book-detail-modal-content",
	templateUrl: "./book-detail-modal-content.component.html",
	styleUrls: ["./book-detail-modal-content.component.scss"],
})
export class BookDetailModalContentComponent implements OnInit {
	public showContent = false;
	@Input() scannedBook: ScannedBook;
	public isbn: string;

	constructor(
		public activeModal: NgbActiveModal,
		private _itemService: ItemService
	) {
		this.showContent = false;
	}

	async ngOnInit() {
		this.isbn = (
			await this._itemService.getById(this.scannedBook.item)
		).info.isbn;
		this.showContent = true;
	}
}
