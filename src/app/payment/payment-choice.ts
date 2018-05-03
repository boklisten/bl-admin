import {PaymentMethod} from '@wizardcoder/bl-model';

export interface PaymentChoice {
	type: PaymentMethod;
	amount: number;
}
