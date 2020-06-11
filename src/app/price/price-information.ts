export interface PriceInformation {
	amount: number;
	unitPrice: number;
	taxRate: number;
	taxAmount: number;
	payLater: number;
	discount?: number;
	discountRate?: number;
}
