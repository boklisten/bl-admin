import { Item } from "@wizardcoder/bl-model";

export interface InvoiceItem {
	title?: string;
	item: Item;
	price: number;
	discount: number;
	numberOfUnits: number;
	total: number;
}
