import {
	Component,
	OnInit,
	Input,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { CustomerItem, Invoice, OrderItem } from "@boklisten/bl-model";
import { InvoiceService } from "@boklisten/bl-connect";
import { ActivatedRoute, Params } from "@angular/router";
import { CustomerItemService, OrderService } from "@boklisten/bl-connect";
import { OrderGeneratorService } from "../../order/order-generator/order-generator.service";
import { PriceService } from "../../price/price.service";

@Component({
	selector: "app-invoice-detail",
	templateUrl: "./invoice-detail.component.html",
	styleUrls: ["./invoice-detail.component.scss"],
})
export class InvoiceDetailComponent implements OnInit, OnChanges {
	@Input() invoice: Invoice;

	constructor(
		private _customerItemService: CustomerItemService,
		private invoiceService: InvoiceService,
		private route: ActivatedRoute,
		private _orderGeneratorService: OrderGeneratorService,
		private _priceService: PriceService,
		private _orderService: OrderService
	) {}

	public ngOnInit() {
		this.route.params.subscribe((params: Params) => {
			const currentId = params["id"];
			if (currentId) {
				this.invoiceService.getById(currentId).then((invoice) => {
					this.invoice = invoice as any;
				});
			}
		});
	}

	public ngOnChanges(simpleChanges: SimpleChanges) {
		if (simpleChanges["inputInvoice"]) {
			this.invoice = simpleChanges.inputInvoice.currentValue;
		}
	}

	private async createInvoiceOrder(customerItemPayments) {
		let customerItems = [];
		try {
			customerItems = (
				await Promise.all(
					customerItemPayments.map(async (payment) => {
						const items = await this._customerItemService.get({
							query: "/" + payment.customerItem,
						});
						return items[0];
					})
				)
			).filter((customerItem: CustomerItem) => !customerItem.returned);
		} catch (error) {}
		customerItemPayments = customerItemPayments.filter((payment) =>
			customerItems.some(
				(customerItem) => customerItem.item === payment.item
			)
		);
		const orderItems = customerItemPayments.map(
			(payment, index): OrderItem => {
				const priceInfo = this._priceService.calculatePriceInformation(
					payment.payment.net,
					payment.taxRate
				);
				return {
					type: "invoice-paid",
					item: payment.item,
					title: payment.title,
					blid: customerItems[index].blid,
					age: "used",
					amount: priceInfo.amount,
					unitPrice: priceInfo.unitPrice,
					taxRate: priceInfo.taxRate,
					taxAmount: priceInfo.taxAmount,
					handout: true,
					info: {
						customerItem: payment.customerItem,
					},
					delivered: true,
					customerItem: payment.customerItem,
				};
			}
		);
		const order = this._orderGeneratorService.generateOrder(
			orderItems,
			customerItems[0].customer,
			false
		);
		try {
			const res = await this._orderService.add(order);
			this._orderService.updateWithOperation(res.id, {}, "place");
		} catch {}
	}

	private async deleteInvoiceOrder() {
		let orders;
		try {
			orders = await this._orderService.get({
				query: `?placed=true&customer=${this.invoice.customerInfo.userDetail}`,
			});
		} catch (e) {
			orders = [];
		}

		const invoiceItems = this.invoice.customerItemPayments;
		const invoiceItemIds = invoiceItems
			.map((invoiceItem) => invoiceItem.item)
			.sort();

		const invoiceOrder = orders.find((order) => {
			const orderItems = order.orderItems;

			if (
				orderItems.some(
					(orderItem) => orderItem.type === "invoice-paid"
				)
			) {
				const orderItemIds = orderItems
					.map((orderItem) => orderItem.item)
					.sort();

				if (
					orderItemIds.every((itemId) =>
						invoiceItemIds.includes(itemId)
					)
				) {
					return order;
				}
			}
		});

		if (!invoiceOrder) {
			throw new Error("Could not find invoice order!");
		}

		this._orderService.remove(invoiceOrder.id);
	}

	private async updateCustomerItems(hasPaid: boolean) {
		if (hasPaid) {
			this.createInvoiceOrder(this.invoice.customerItemPayments);
		} else {
			this.deleteInvoiceOrder();
		}
		Promise.all(
			this.invoice.customerItemPayments.map((payment) => {
				return this._customerItemService.update(
					payment.customerItem as string,
					{ buyout: hasPaid }
				);
			})
		);
	}

	public async onCustomerHavePayedChange(customerHavePayed: boolean) {
		this.invoice.customerHavePayed = customerHavePayed;
		this.invoice.toDebtCollection = false;
		this.invoice.toCreditNote = false;
		this.invoice.toLossNote = false;
		this.updateInvoiceStatus();
		this.updateCustomerItems(customerHavePayed);
	}

	public onInvoiceToDebtCollection(toDebtCollection: boolean) {
		this.invoice.toDebtCollection = toDebtCollection;
		this.invoice.customerHavePayed = false;
		this.invoice.toCreditNote = false;
		this.invoice.toLossNote = false;
		this.updateInvoiceStatus();
	}

	public onInvoiceToCreditNote(toCreditNote: boolean) {
		this.invoice.toCreditNote = toCreditNote;
		this.invoice.customerHavePayed = false;
		this.invoice.toDebtCollection = false;
		this.invoice.toLossNote = false;
		this.updateInvoiceStatus();
	}

	public onInvoiceToLossNote(toLossNote: boolean) {
		this.invoice.toLossNote = toLossNote;
		this.invoice.toCreditNote = false;
		this.invoice.customerHavePayed = false;
		this.invoice.toDebtCollection = false;
		this.updateInvoiceStatus();
	}

	private updateInvoiceStatus() {
		this.invoiceService
			.update(this.invoice.id, {
				toCreditNote: this.invoice.toCreditNote,
				toDebtCollection: this.invoice.toDebtCollection,
				customerHavePayed: this.invoice.customerHavePayed,
				toLossNote: this.invoice.toLossNote,
			})
			.then(() => {})
			.catch((err) => {});
	}

	public onCustomerItemPaymentCancel(index: number) {
		this.invoice.customerItemPayments[index].cancel = !this.invoice
			.customerItemPayments[index].cancel;
		this.invoiceService
			.update(this.invoice.id, {
				customerItemPayments: this.invoice.customerItemPayments,
			})
			.then(() => {})
			.catch((err) => {});
	}
}
