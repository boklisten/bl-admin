import {Pipe, PipeTransform} from '@angular/core';
import {ItemPriceService} from '../../../price/item-price/item-price.service';

@Pipe({
	name: 'blcPrice'
})
export class BlcPricePipe implements PipeTransform {
	constructor(private _itemPriceService: ItemPriceService) {

	}
	transform(price: number): any {
		return price.toString() + ' kr';
	}

}
