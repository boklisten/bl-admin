import { Pipe, PipeTransform } from "@angular/core";
import { Item } from "@wizardcoder/bl-model";
import { BranchStoreService } from "../../branch/branch-store.service";
import { ItemPriceService } from "../item-price/item-price.service";

@Pipe({
	name: "itemPrice"
})
export class ItemPricePipe implements PipeTransform {
	constructor(private _itemPriceService: ItemPriceService) {}

	transform(
		item: Item,
		type: "rent" | "buy" | "sell",
		period?: "semester" | "year",
		numberOfPeriods?: number
	): any {
		if (type === undefined) {
			return -1;
		}

		switch (type) {
			case "rent":
				return this.prettyOutput(
					this.calculatePriceRent(item, period, numberOfPeriods)
				);
			case "buy":
				return this.prettyOutput(this.calculatePriceBuy(item));
			case "sell":
				return this.prettyOutput(this.calculatePriceSell(item));
			default:
				return -1;
		}
	}

	private prettyOutput(price: number) {
		return price.toString() + " kr";
	}

	private calculatePriceRent(
		item: Item,
		periodType: "semester" | "year",
		numberOfPeriods: number
	): number {
		//return this._itemPriceService.rentPrice(item, periodType, numberOfPeriods);
		return -1;
	}

	private calculatePriceBuy(item: Item) {
		return this._itemPriceService.buyPrice(item);
	}

	private calculatePriceSell(item: Item) {
		return this._itemPriceService.sellPrice(item);
	}
}
