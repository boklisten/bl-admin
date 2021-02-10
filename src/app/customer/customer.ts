import { Order, UserDetail, CustomerItem } from "@boklisten/bl-model";

export class Customer {
	detail: UserDetail;
	orders?: Order[];
	customerItems?: CustomerItem[];
}
