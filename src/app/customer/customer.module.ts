import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerRoutingModule} from './customer-routing.module';
import {CustomerSearchComponent} from './customer-search/customer-search.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CustomerSearchResultComponent } from './customer-search/customer-search-result/customer-search-result.component';
import {CustomerSearchService} from './customer-search/customer-search.service';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerDetailModalComponent} from './customer-detail/customer-detail-modal/customer-detail-modal.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {CustomerDetailModalContentComponent} from './customer-detail/customer-detail-modal/customer-detail-modal-content/customer-detail-modal-content.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CustomerRoutingModule,
		FontAwesomeModule,
		NgbModalModule
	],
	providers: [
		CustomerSearchService
	],
	declarations: [
		CustomerSearchComponent,
		CustomerSearchResultComponent,
		CustomerDetailComponent,
		CustomerDetailModalComponent,
		CustomerDetailModalComponent,
		CustomerDetailModalContentComponent
	],
	entryComponents: [CustomerDetailModalContentComponent]
})
export class CustomerModule {
}
