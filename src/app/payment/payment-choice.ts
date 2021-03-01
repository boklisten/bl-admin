import { PaymentMethod } from "@boklisten/bl-model";

export interface PaymentChoice {
	type: PaymentMethod;
	amount: number;
}
