import { Injectable } from "@angular/core";
import { CustomerItem, UserDetail, Invoice, Item } from "@wizardcoder/bl-model";
import {
	InvoiceService,
	UserDetailService,
	ItemService
} from "@wizardcoder/bl-connect";
import { CustomerItemHandlerService } from "../../customer-item/customer-item-handler/customer-item-handler.service";

@Injectable({
	providedIn: "root"
})
export class InvoiceGeneratorService {
	private unsavedInvoices: Invoice[];

	constructor(
		private invoiceService: InvoiceService,
		private customerItemHandlerService: CustomerItemHandlerService,
		private userDetailService: UserDetailService,
		private itemService: ItemService
	) {}

	/**
	 * Creates invoices based on customerItems not delivered on a set deadline
	 */
	public async createInvoices(
		reference: number,
		period: { fromDate: Date; toDate: Date }
	): Promise<Invoice[]> {
		const notReturnedCustomerItems = await this.customerItemHandlerService.getNotReturned(
			period
		);

		const groupedCustomerItems = await this.groupCustomerItemsByCustomer(
			notReturnedCustomerItems
		);

		const generatedInvoices = await this.generateInvoices(
			reference,
			groupedCustomerItems
		);

		return Promise.resolve(generatedInvoices);
	}

	public async addInvoices(invoices: Invoice[]): Promise<Invoice[]> {
		let promiseArr: Promise<Invoice>[] = invoices.map(invoice => {
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
		let customersAndCustomerItems = {}; //{customer: string, customerItems: CustomerItem[]};

		for (let customerItem of customerItems) {
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

		let customersAndCustomerItemsArray = [];

		for (const key in customersAndCustomerItems) {
			customersAndCustomerItemsArray.push({
				customer: key,
				customerItems: customersAndCustomerItems[key]["customerItems"]
			});
		}

		return customersAndCustomerItemsArray;
	}

	private async generateInvoices(
		reference: number,
		customersWithCustomerItems: {
			customer: string | UserDetail;
			customerItems: CustomerItem[];
		}[]
	): Promise<Invoice[]> {
		let invoices = [];
		let duedate = new Date();

		for (let customerWithCustomerItem of customersWithCustomerItems) {
			customerWithCustomerItem.customer = await this.userDetailService.getById(
				customerWithCustomerItem.customer as string
			);

			invoices.push(
				this.convertToInvoice(
					reference,
					duedate,
					customerWithCustomerItem.customer,
					customerWithCustomerItem.customerItems
				)
			);
			reference += 1;
		}

		return invoices;
	}

	private convertToInvoice(
		reference: number,
		duedate: Date,
		userDetail: UserDetail,
		customerItems: CustomerItem[]
	): Invoice {
		let invoice = {
			duedate: duedate,
			customerHavePayed: false,
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
				}
			},
			reference: reference.toString()
		} as Invoice;

		invoice = this.calculateTotalPayment(invoice);

		return invoice;
	}

	private createCustomerItemPayments(customerItems: CustomerItem[]): any[] {
		let customerItemPayments = [];

		for (let customerItemObj of customerItems) {
			let item = customerItemObj.item as Item;
			customerItemPayments.push({
				customerItem: customerItemObj.id,
				title: item.title,
				numberOfItems: 1,
				payment: {
					unit: this.itemUnitPrice(item),
					gross: this.itemGrossPrice(item),
					net: this.itemNetPrice(item),
					vat: this.itemVatPrice(item),
					discount: this.itemDiscountPrice(item)
				}
			});
		}

		return customerItemPayments;
	}

	private calculateTotalPayment(invoice) {
		for (let customerItemPayment of invoice.customerItemPayments) {
			invoice.payment.total.gross += customerItemPayment.payment.gross;
			invoice.payment.total.net += customerItemPayment.payment.net;
			invoice.payment.total.vat += customerItemPayment.payment.vat;
		}

		return invoice;
	}

	private itemUnitPrice(item: Item): number {
		return item.price;
	}

	private itemGrossPrice(item: Item): number {
		return item.price;
	}

	private itemNetPrice(item: Item): number {
		return this.itemGrossPrice(item) - this.itemVatPrice(item);
	}

	private itemVatPrice(item: Item): number {
		return item.price * item.taxRate;
	}

	private itemDiscountPrice(item: Item): number {
		return 0;
	}
}
