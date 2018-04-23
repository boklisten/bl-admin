import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ItemRoutingModule} from './item-routing.module';
import {ItemDetailComponent} from './item-detail/item-detail.component';
import {BlCommonModule} from '../bl-common/bl-common.module';
import { ItemDetailCardComponent } from './item-detail/item-detail-card/item-detail-card.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { ItemSearchComponent } from './item-search/item-search.component';
import {ItemSearchService} from './item-search/item-search.service';
import { ItemSearchResultComponent } from './item-search/item-search-result/item-search-result.component';
import {PriceModule} from '../price/price.module';
import { ItemSearchBarComponent } from './item-search-bar/item-search-bar.component';

@NgModule({
	imports: [
		CommonModule,
		ItemRoutingModule,
		BlCommonModule,
		FontAwesomeModule,
		PriceModule
	],
	declarations: [
		ItemDetailComponent,
		ItemDetailCardComponent,
		ItemSearchComponent,
		ItemSearchResultComponent,
		ItemSearchBarComponent
	],
	providers: [
		ItemSearchService
	],
	exports: [
		ItemSearchBarComponent
	]
})
export class ItemModule {
}
