import { Item } from "@boklisten/bl-model";

export interface InvoiceItem {
	title?: string;
	productNumber?: number;
	item: Item;
	price: number;
	discount: number;
	numberOfUnits: number;
	total: number;
	tax: number;
	taxPercentage: number;
}
