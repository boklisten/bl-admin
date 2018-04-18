import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrderRoutingModule} from './order-routing.module';
import {CustomerOrderListComponent} from './customer-order/customer-order-list/customer-order-list.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BlCommonModule} from '../bl-common/bl-common.module';

@NgModule({
	imports: [
		CommonModule,
		OrderRoutingModule,
		FontAwesomeModule,
		BlCommonModule
	],
	declarations: [CustomerOrderListComponent],
	exports: [
		CustomerOrderListComponent
	]
})
export class OrderModule {
}
