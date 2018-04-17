import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerRoutingModule} from './customer-routing.module';
import {CustomerSearchComponent} from './customer-search/customer-search.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';
import { CustomerSearchResultComponent } from './customer-search/customer-search-result/customer-search-result.component';
import {CustomerSearchService} from './customer-search/customer-search.service';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CustomerRoutingModule,
		FontAwesomeModule
	],
	providers: [
		CustomerSearchService
	],
	declarations: [CustomerSearchComponent, CustomerSearchResultComponent, CustomerDetailComponent]
})
export class CustomerModule {
}
