import { Order, UserDetail, CustomerItem } from "@wizardcoder/bl-model";

export class Customer {
	detail: UserDetail;
	orders?: Order[];
	customerItems?: CustomerItem[];
}
