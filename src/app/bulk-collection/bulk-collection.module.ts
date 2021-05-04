import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UniqueItemModule } from "../unique-item/unique-item.module";
import { BulkCollectionRoutingModule } from "./bulk-collection-routing.module";
import { BulkCollectionComponent } from "./bulk-collection.component";
import { BookDetailModalComponent } from "./book-detail-modal/book-detail-modal.component";
import { BookDetailModalContentComponent } from "./book-detail-modal/book-detail-modal-content/book-detail-modal-content.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserOrderSummaryComponent } from "./user-order-summary/user-order-summary.component";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { BulkHistoryComponent } from "./bulk-history/bulk-history.component";
@NgModule({
	imports: [
		CommonModule,
		BulkCollectionRoutingModule,
		UniqueItemModule,
		FontAwesomeModule,
		NgbCollapseModule,
	],
	declarations: [
		BulkCollectionComponent,
		BookDetailModalComponent,
		BookDetailModalContentComponent,
		UserOrderSummaryComponent,
		BulkHistoryComponent,
	],
	entryComponents: [BookDetailModalContentComponent],
})
export class BulkCollectionModule {}
