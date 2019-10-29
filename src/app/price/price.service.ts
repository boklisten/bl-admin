import { Injectable } from "@angular/core";

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

	private sanitizeNum(sanitizeNumber: number): number {
		return +sanitizeNumber.toFixed(0);
	}
}
