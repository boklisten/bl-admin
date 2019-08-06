import { Injectable } from "@angular/core";
import {
	CustomerItem,
	CustomerItemType,
	UserDetail,
	Invoice,
	Item
} from "@wizardcoder/bl-model";
import { DateService } from "../../date/date.service";
import {
	InvoiceService,
	UserDetailService,
	ItemService
} from "@wizardcoder/bl-connect";
import { CustomerItemHandlerService } from "../../customer-item/customer-item-handler/customer-item-handler.service";
import { PriceService } from "../../price/price.service";

@Injectable({
	providedIn: "root"
})
export class InvoiceGeneratorService {
	private unsavedInvoices: Invoice[];
	private feePercentage: number;
	private feeVatPercentage: number;
	private fee: number;
	private daysToDeadline: number;

	constructor(
		private invoiceService: InvoiceService,
		private customerItemHandlerService: CustomerItemHandlerService,
		private userDetailService: UserDetailService,
		private itemService: ItemService,
		private priceService: PriceService,
		private dateService: DateService
	) {
		this.feePercentage = 1.1;
		this.feeVatPercentage = 0.25;
		this.fee = 75;
		this.daysToDeadline = 14;
	}

	/**
	 * Creates invoices based on customerItems not delivered on a set deadline
	 */
	public async createInvoices(
		settings: {
			feePercentage: number;
			fee: number;
			daysToDeadline: number;
			feeVatPercentage: number;
		},
		customerItemType: CustomerItemType,
		reference: string,
		invoiceNumber: number,
		period: { fromDate: Date; toDate: Date }
	): Promise<Invoice[]> {
		this.fee = settings.fee;
		this.feePercentage = settings.feePercentage;
		this.feeVatPercentage = settings.feeVatPercentage;
		this.daysToDeadline = settings.daysToDeadline;

		const notReturnedCustomerItems = await this.customerItemHandlerService.getNotReturnedCustomerItems(
			customerItemType,
			period.fromDate,
			[]
		);

		const groupedCustomerItems = await this.groupCustomerItemsByCustomer(
			notReturnedCustomerItems
		);

		const generatedInvoices = await this.generateInvoices(
			reference,
			invoiceNumber,
			customerItemType,
			groupedCustomerItems
		);

		return Promise.resolve(generatedInvoices);
	}

	public async addInvoices(invoices: Invoice[]): Promise<Invoice[]> {
		const promiseArr: Promise<Invoice>[] = invoices.map(invoice => {
			return this.invoiceService.add(invoice);
		});

		return await Promise.all(promiseArr);
	}

	public setUnsavedInvoices(invoices: Invoice[]) {
		this.unsavedInvoices = invoices;
	}

	public getCurrentUnsavedInvoices(): Invoice[] {
		return this.unsavedInvoices;
	}

	private async groupCustomerItemsByCustomer(
		customerItems: CustomerItem[]
	): Promise<{ customer: string; customerItems: CustomerItem[] }[]> {
		const customersAndCustomerItems = {}; // {customer: string, customerItems: CustomerItem[]};

		for (const customerItem of customerItems) {
			customerItem.item = await this.itemService.getById(
				customerItem.item as string
			);

			if (!customersAndCustomerItems[customerItem.customer as string]) {
				customersAndCustomerItems[customerItem.customer as string] = {
					customerItems: []
				};
			}
			customersAndCustomerItems[customerItem.customer as string][
				"customerItems"
			].push(customerItem);
		}

		const customersAndCustomerItemsArray = [];

		for (const key in customersAndCustomerItems) {
			if (key) {
				customersAndCustomerItemsArray.push({
					customer: key,
					customerItems:
						customersAndCustomerItems[key]["customerItems"]
				});
			}
		}

		return customersAndCustomerItemsArray;
	}

	private async generateInvoices(
		reference: string,
		invoiceNumber: number,
		customerItemType: CustomerItemType,
		customersWithCustomerItems: {
			customer: string | UserDetail;
			customerItems: CustomerItem[];
		}[]
	): Promise<Invoice[]> {
		const invoices = [];
		const duedate = this.dateService.addDays(
			new Date(),
			this.daysToDeadline
		);

		for (const customerWithCustomerItem of customersWithCustomerItems) {
			customerWithCustomerItem.customer = await this.userDetailService.getById(
				customerWithCustomerItem.customer as string
			);

			invoices.push(
				this.convertToInvoice(
					reference,
					invoiceNumber,
					duedate,
					customerItemType,
					customerWithCustomerItem.customer,
					customerWithCustomerItem.customerItems
				)
			);
			invoiceNumber += 1;
		}

		return invoices;
	}

	private convertToInvoice(
		reference: string,
		invoiceNumber: number,
		duedate: Date,
		customerItemType: CustomerItemType,
		userDetail: UserDetail,
		customerItems: CustomerItem[]
	): Invoice {
		const branch =
			userDetail.branch !== undefined
				? userDetail.branch
				: customerItems[0].handoutInfo &&
				  customerItems[0].handoutInfo["handoutById"]
				? customerItems[0].handoutInfo["handoutById"]
				: "";
		let invoice = {
			duedate: duedate,
			customerHavePayed: false,
			branch: branch,
			type: customerItemType,
			customerItemPayments: this.createCustomerItemPayments(
				customerItems
			),
			customerInfo: {
				userDetail: userDetail.id,
				name: userDetail.name,
				email: userDetail.email,
				phone: userDetail.phone,
				dob: userDetail.dob,
				postal: {
					address: userDetail.address,
					city: userDetail.postCity,
					code: userDetail.postCode,
					country: userDetail.country
				}
			},
			payment: {
				total: {
					gross: 0,
					net: 0,
					vat: 0,
					discount: 0
				},
				fee: {
					unit: 0,
					gross: 0,
					net: 0,
					vat: 0,
					discount: 0
				},
				totalIncludingFee: 0
			},
			reference: reference,
			invoiceId: invoiceNumber.toString()
		} as Invoice;

		invoice = this.calculateFeePayment(invoice);
		invoice = this.calculateTotalPayment(invoice);

		invoice.payment.totalIncludingFee = invoice.payment.total.gross;

		return invoice;
	}

	private createCustomerItemPayments(customerItems: CustomerItem[]): any[] {
		const customerItemPayments = [];

		for (const customerItemObj of customerItems) {
			const item = customerItemObj.item as Item;
			customerItemPayments.push({
				customerItem: customerItemObj.id,
				customerItemType: customerItemObj.type,
				title: item.title,
				item: item.id,
				numberOfItems: 1,
				payment: this.createCustomerItemInvoicePayment(
					customerItemObj,
					customerItemObj.item as Item
				)
			});
		}

		return customerItemPayments;
	}

	private createCustomerItemInvoicePayment(
		customerItem: CustomerItem,
		item: Item
	): {
		unit: number;
		gross: number;
		net: number;
		vat: number;
		discount: number;
	} {
		if (customerItem.type === "partly-payment") {
			return {
				unit: customerItem.amountLeftToPay,
				gross: customerItem.amountLeftToPay,
				net: customerItem.amountLeftToPay,
				vat: 0,
				discount: 0
			};
		}
		return {
			unit: this.itemUnitPrice(item),
			gross: this.itemGrossPrice(item),
			net: this.itemNetPrice(item),
			vat: this.itemVatPrice(item),
			discount: this.itemDiscountPrice(item)
		};
	}

	private calculateTotalPayment(invoice: Invoice) {
		for (const customerItemPayment of invoice.customerItemPayments) {
			invoice.payment.total.gross += customerItemPayment.payment.gross;
			invoice.payment.total.net += customerItemPayment.payment.net;
			invoice.payment.total.vat += customerItemPayment.payment.vat;
		}

		invoice.payment.total.gross += invoice.payment.fee.gross;
		invoice.payment.total.net += invoice.payment.fee.net;
		invoice.payment.total.vat += invoice.payment.fee.vat;

		return invoice;
	}

	private calculateFeePayment(invoice: Invoice) {
		invoice.payment.fee.unit = this.fee;
		invoice.payment.fee.net = this.priceService.toFixed(
			invoice.customerItemPayments.length * this.fee
		);
		invoice.payment.fee.vat = this.priceService.toFixed(
			invoice.payment.fee.net * this.feeVatPercentage
		);
		invoice.payment.fee.gross =
			invoice.payment.fee.net + invoice.payment.fee.vat;
		return invoice;
	}

	private itemUnitPrice(item: Item): number {
		return item.price;
	}

	private itemGrossPrice(item: Item): number {
		return this.priceService.toFixed(item.price * this.feePercentage);
	}

	private itemNetPrice(item: Item): number {
		return this.itemGrossPrice(item) - this.itemVatPrice(item);
	}

	private itemVatPrice(item: Item): number {
		return this.priceService.toFixed(
			this.itemGrossPrice(item) * item.taxRate
		);
	}

	private itemDiscountPrice(item: Item): number {
		return 0;
	}
}
