import { Injectable } from "@angular/core";
import { PriceInformation } from "./price-information";

@Injectable({
	providedIn: "root"
})
export class PriceService {
	constructor() {}

	public sanitize(price: number): number {
		/*if (price <= 0) {
			return this.sanitizeNum(price);
		}*/

		return this.sanitizeNum(parseInt((price / 10).toString(), 10) * 10);
	}

	public withTwoDecimals(num: number): number {
		return +num.toFixed(2);
	}

	public toFixed(num: number): number {
		return this.sanitizeNum(num);
	}

	public getEmptyPriceInformation(): PriceInformation {
		return {
			amount: 0,
			unitPrice: 0,
			taxRate: 0,
			taxAmount: 0,
			amountLeftToPay: 0,
			alreadyPayed: 0,
			discount: 0,
			discountRate: 0
		};
	}

	private sanitizeNum(sanitizeNumber: number): number {
		return +sanitizeNumber.toFixed(0);
	}
}
