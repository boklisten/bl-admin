import {Order, UserDetail} from '@wizardcoder/bl-model';

export class Customer {
	detail: UserDetail;
	orders?: Order[];
}
