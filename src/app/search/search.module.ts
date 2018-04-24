import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './search.component';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {ItemModule} from '../item/item.module';
import {CustomerModule} from '../customer/customer.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
	imports: [
		CommonModule,
		SearchRoutingModule,
		NgbTabsetModule,
		ItemModule,
		CustomerModule,
		FontAwesomeModule
	],
	declarations: [SearchComponent]
})
export class SearchModule {
}
