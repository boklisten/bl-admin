import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemPricePipe} from './pipes/item-price.pipe';
import {ItemPriceService} from './item-price/item-price.service';
import {OrderItemPriceService} from './order-item-price/order-item-price.service';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [ItemPricePipe],
	providers: [
		ItemPriceService,
		OrderItemPriceService
	],
	exports: [
		ItemPricePipe
	]
})
export class PriceModule {
}
