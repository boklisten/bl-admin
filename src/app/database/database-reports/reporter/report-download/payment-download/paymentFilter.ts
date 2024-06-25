import { PaymentMethod } from "@boklisten/bl-model";

export interface PaymentFilter {
	branchIds?: string[];
	fromDate?: Date;
	toDate?: Date;
	methods?: PaymentMethod[];
}
