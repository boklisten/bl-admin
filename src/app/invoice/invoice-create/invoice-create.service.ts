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
		invoiceItems: InvoiceItem[]
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
				customerNumber: company.id,
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
			}
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
			invoiceItem.discount = 1 - parseFloat(invoiceItem.discount + "");

			invoiceItemPayments.push({
				customerItem: null,
				customerItemType: null,
				title: invoiceItem.item.title,
				item: invoiceItem.item.id,
				numberOfItems: parseFloat(invoiceItem.numberOfUnits + ""),
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
		return parseFloat(invoiceItem.price + "");
	}

	private itemGrossPrice(invoiceItem: InvoiceItem): number {
		return this.priceService.sanitize(
			this.itemUnitPrice(invoiceItem) *
				parseFloat(invoiceItem.numberOfUnits + "") *
				parseFloat(invoiceItem.discount + "")
		);
	}

	private itemNetPrice(invoiceItem: InvoiceItem): number {
		return this.priceService.sanitize(
			this.itemGrossPrice(invoiceItem) - this.itemVatPrice(invoiceItem)
		);
	}

	private itemVatPrice(invoiceItem: InvoiceItem): number {
		return this.priceService.sanitize(
			this.itemGrossPrice(invoiceItem) * invoiceItem.item.taxRate
		);
	}

	private itemDiscountPrice(invoiceItem: InvoiceItem): number {
		return this.priceService.sanitize(
			parseFloat(invoiceItem.price + "") *
				parseFloat(invoiceItem.discount + "")
		);
	}
}
