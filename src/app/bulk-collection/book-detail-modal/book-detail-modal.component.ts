import { Component, Input, OnInit } from "@angular/core";
import { ScannedBook } from "@boklisten/bl-model/bulk-collection/bulk-collection";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BookDetailModalContentComponent } from "./book-detail-modal-content/book-detail-modal-content.component";

@Component({
	selector: "app-book-detail-modal",
	templateUrl: "./book-detail-modal.component.html",
	styleUrls: ["./book-detail-modal.component.scss"],
})
export class BookDetailModalComponent implements OnInit {
	@Input() scannedBook: ScannedBook;

	constructor(private _modalService: NgbModal) {}

	ngOnInit() {}

	public onShowModal() {
		setTimeout(() => {
			const modalRef = this._modalService.open(
				BookDetailModalContentComponent
			);
			modalRef.componentInstance.scannedBook = this.scannedBook;
		});
	}
}
