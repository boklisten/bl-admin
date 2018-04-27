import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerItemRoutingModule} from './customer-item-routing.module';
import {CustomerItemHandlerService} from './customer-item-handler/customer-item-handler.service';

@NgModule({
	imports: [
		CommonModule,
		CustomerItemRoutingModule
	],
	declarations: [],
	providers: [
		CustomerItemHandlerService
	]
})
export class CustomerItemModule {
}
