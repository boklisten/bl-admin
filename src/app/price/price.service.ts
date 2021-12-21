import { Injectable } from "@angular/core";
import { PriceInformation } from "./price-information";

@Injectable({
	providedIn: "root",
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
			discountRate: 0,
		};
	}

	public calculatePriceInformation(
		amount: number,
		taxRate: number,
		amountLeftToPay?: number,
		alreadyPayed?: number
	): PriceInformation {
		const taxAmount =
			amount > 0 && taxRate > 0
				? this.toFixed(amount - amount / taxRate)
				: 0;

		return this.sanitizePriceInformation({
			amount: this.toFixed(amount),
			unitPrice: this.toFixed(amount - taxAmount),
			taxRate: taxAmount > 0 ? taxRate : 0,
			taxAmount: taxAmount,
			amountLeftToPay: this.toFixed(amountLeftToPay ?? 0),
			alreadyPayed: this.toFixed(alreadyPayed ?? 0),
			discountRate: this.toFixed(0),
			discount: this.toFixed(0),
		});
	}

	public addPriceInformation(
		originalPriceInformation: PriceInformation,
		priceInformationToAdd: PriceInformation
	): PriceInformation {
		const original = this.sanitizePriceInformation(
			originalPriceInformation
		);
		const toAdd = this.sanitizePriceInformation(priceInformationToAdd);

		return {
			amount: original.amount + toAdd.amount,
			unitPrice: original.unitPrice + toAdd.unitPrice,
			taxRate: original.taxRate,
			taxAmount: original.taxAmount + toAdd.taxAmount,
			amountLeftToPay: original.amountLeftToPay + toAdd.amountLeftToPay,
			alreadyPayed: original.alreadyPayed + toAdd.alreadyPayed,
			discountRate: original.discountRate,
			discount: original.discount,
		};
	}

	public sanitizePriceInformation(pi: PriceInformation): PriceInformation {
		return {
			amount: pi.amount ? this.sanitize(pi.amount) : 0,
			unitPrice: pi.unitPrice ? this.sanitize(pi.unitPrice) : 0,
			taxRate: pi.taxRate ? pi.taxRate : 0,
			taxAmount: pi.taxAmount ? pi.taxAmount : 0,
			amountLeftToPay: Math.round(pi.amountLeftToPay / 10) * 10,
			alreadyPayed: pi.alreadyPayed ? pi.alreadyPayed : 0,
			discountRate: pi.discountRate ? pi.discountRate : 0,
			discount: pi.discount ? pi.discount : 0,
		};
	}

	public subtractPriceInformation(
		priceInformation: PriceInformation,
		originalPriceInformation: PriceInformation
	): PriceInformation {
		const amount =
			priceInformation.amount - originalPriceInformation.amount;

		return this.calculatePriceInformation(
			amount,
			priceInformation.taxRate,
			originalPriceInformation.amountLeftToPay,
			originalPriceInformation.alreadyPayed
		);
	}

	private sanitizeNum(sanitizeNumber: number): number {
		return +sanitizeNumber.toFixed(0);
	}
}
