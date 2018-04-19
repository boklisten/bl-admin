import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ItemRoutingModule} from './item-routing.module';
import {ItemDetailComponent} from './item-detail/item-detail.component';
import {BlCommonModule} from '../bl-common/bl-common.module';
import { ItemDetailCardComponent } from './item-detail/item-detail-card/item-detail-card.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
	imports: [
		CommonModule,
		ItemRoutingModule,
		BlCommonModule,
		FontAwesomeModule
	],
	declarations: [ItemDetailComponent, ItemDetailCardComponent]
})
export class ItemModule {
}
