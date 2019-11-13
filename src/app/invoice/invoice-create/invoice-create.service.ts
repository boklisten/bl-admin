import { Injectable } from "@angular/core";
import { InvoiceItem } from "./invoice-create-item-list/invoice-item";
import { Company, Invoice, Item } from "@wizardcoder/bl-model";
import { PriceService } from "../../price/price.service";
import { InvoiceService } from "@wizardcoder/bl-connect";
import * as moment from "moment";

@Injectable({
	providedIn: "root"
})
export class InvoiceCreateService {
	constructor(
		private priceService: PriceService,
		private invoiceService: InvoiceService
	) {}

	public createCompanyInvoice(
		reference: string,
		ourReference: string,
		invoiceNumber: string,
		company: Company,
		invoiceItems: InvoiceItem[],
		comment?: string
	): Promise<Invoice> {
		let invoice: Invoice = {
			id: "",
			invoiceId: invoiceNumber,
			reference: reference,
			duedate: moment()
				.add(2, "weeks")
				.toDate(),
			customerHavePayed: false,
			toCreditNote: false,
			toDebtCollection: false,
			ourReference: ourReference,
			branch: null,
			type: null,
			customerItemPayments: this.createInvoiceItemPayments(invoiceItems),
			customerInfo: {
				name: company.name,
				email: company.contactInfo.email,
				phone: company.contactInfo.phone,
				organizationNumber: company.organizationNumber,
				customerNumber: company.customerNumber,
				postal: {
					address: company.contactInfo.address,
					city: company.contactInfo.postCity,
					code: company.contactInfo.postCode,
					country: "norway"
				}
			},
			payment: {
				total: {
					gross: 0,
					net: 0,
					vat: 0,
					discount: 0
				},
				fee: null,
				totalIncludingFee: 0
			},
			comments: comment
				? [
						{
							id: "",
							msg: comment,
							creationTime: new Date(),
							user: null
						}
				  ]
				: []
		};

		invoice = this.calculateTotalPayment(invoice);

		return new Promise((resolve, reject) => {
			this.invoiceService
				.add(invoice)
				.then(addedInvoice => {
					resolve(addedInvoice);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	private calculateTotalPayment(invoice: Invoice): Invoice {
		for (const customerItemPayment of invoice.customerItemPayments) {
			invoice.payment.total.gross += customerItemPayment.payment.gross;
			invoice.payment.total.net += customerItemPayment.payment.net;
			invoice.payment.total.vat += customerItemPayment.payment.vat;
			invoice.payment.total.discount +=
				customerItemPayment.payment.discount;
		}

		invoice.payment.totalIncludingFee = invoice.payment.total.gross;
		return invoice;
	}

	private createInvoiceItemPayments(invoiceItems: InvoiceItem[]) {
		const invoiceItemPayments = [];

		for (const invoiceItem of invoiceItems) {
			invoiceItem.numberOfUnits = parseFloat(
				invoiceItem.numberOfUnits + ""
			);
			invoiceItem.discount = parseFloat(invoiceItem.discount + "");
			invoiceItem.total = parseFloat(invoiceItem.total + "");
			invoiceItem.price = parseFloat(invoiceItem.price + "");

			invoiceItem.discount = 1 - invoiceItem.discount / 100;

			invoiceItemPayments.push({
				customerItem: null,
				customerItemType: null,
				title: invoiceItem.title,
				item: null,
				numberOfItems: parseFloat(invoiceItem.numberOfUnits + ""),
				productNumber: invoiceItem.productNumber,
				payment: {
					unit: this.itemUnitPrice(invoiceItem),
					gross: this.itemGrossPrice(invoiceItem),
					net: this.itemNetPrice(invoiceItem),
					vat: this.itemVatPrice(invoiceItem),
					discount: this.itemDiscountPrice(invoiceItem)
				}
			});
		}
		return invoiceItemPayments;
	}

	private itemUnitPrice(invoiceItem: InvoiceItem): number {
		return invoiceItem.price;
	}

	private itemGrossPrice(invoiceItem: InvoiceItem): number {
		return this.priceService.withTwoDecimals(
			this.itemUnitPrice(invoiceItem) *
				invoiceItem.discount *
				invoiceItem.numberOfUnits
		);
	}

	private itemNetPrice(invoiceItem: InvoiceItem): number {
		return this.priceService.withTwoDecimals(
			this.itemGrossPrice(invoiceItem) - this.itemVatPrice(invoiceItem)
		);
	}

	private itemVatPrice(invoiceItem: InvoiceItem): number {
		return this.priceService.withTwoDecimals(
			this.itemGrossPrice(invoiceItem) *
				invoiceItem.item.taxRate *
				invoiceItem.numberOfUnits
		);
	}

	private itemDiscountPrice(invoiceItem: InvoiceItem): number {
		return (1 - invoiceItem.discount) * 100;
	}
}
