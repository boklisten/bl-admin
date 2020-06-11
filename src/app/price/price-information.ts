export interface PriceInformation {
	amount: number;
	unitPrice: number;
	taxRate: number;
	taxAmount: number;
	amountLeftToPay?: number;
	alreadyPayed?: number;
	discount?: number;
	discountRate?: number;
}
