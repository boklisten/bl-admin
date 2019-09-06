import { Item } from "@wizardcoder/bl-model";

export interface InvoiceItem {
	item: Item;
	price: number;
	discount: number;
	numberOfUnits: number;
	total: number;
}
