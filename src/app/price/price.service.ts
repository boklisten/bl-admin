import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PriceService {

	constructor() {
	}

	public sanitize(price: number): number {

		/*if (price <= 0) {
			return this.sanitizeNum(price);
		}*/

		return this.sanitizeNum((parseInt((price / 10).toString(), 10)) * 10);
	}

	private sanitizeNum(sanitizeNumber: number): number {
		return +sanitizeNumber.toFixed(0);
	}
}
