import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerItemRoutingModule} from './customer-item-routing.module';
import {CustomerItemHandlerService} from './customer-item-handler/customer-item-handler.service';
import { CustomerItemDetailComponent } from './customer-item-detail/customer-item-detail.component';
import {BlCommonModule} from '../bl-common/bl-common.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
	imports: [
		CommonModule,
		CustomerItemRoutingModule,
		BlCommonModule,
		FontAwesomeModule
	],
	declarations: [CustomerItemDetailComponent],
	providers: [
		CustomerItemHandlerService
	]
})
export class CustomerItemModule {
}
