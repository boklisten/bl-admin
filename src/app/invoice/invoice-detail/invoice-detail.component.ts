import {
	Component,
	OnInit,
	Input,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { Invoice, OrderItem } from "@boklisten/bl-model";
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

	private async createBuyoutOrder(customerItemPayments) {
		let customerItems = [];
		try {
			customerItems = await Promise.all(
				customerItemPayments.map(async (payment) => {
					const items = await this._customerItemService.get({
						query: "/" + payment.customerItem,
					});
					return items[0];
				})
			);
		} catch (error) {}
		const orderItems = customerItemPayments.map(
			(payment, index): OrderItem => {
				const priceInformation = this._priceService.getEmptyPriceInformation();

				return {
					type: "buyout",
					item: payment.item,
					title: payment.title,
					blid: customerItems[index].blid,
					age: "used",
					amount: priceInformation.amount,
					unitPrice: priceInformation.unitPrice,
					taxRate: priceInformation.taxRate,
					taxAmount: priceInformation.taxAmount,
					handout: true,
					info: {
						buybackAmount: priceInformation.amount,
						customerItem: payment.customerItem,
					},
					discount: null,
					delivered: true,
					customerItem: payment.customerItem,
					match: null,
					movedToOrder: null,
					movedFromOrder: null,
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

	private async updateCustomerItemsBuyoutStatus(buyout) {
		if (buyout) {
			this.createBuyoutOrder(this.invoice.customerItemPayments);
		}
		Promise.all(
			this.invoice.customerItemPayments.map((payment) => {
				return this._customerItemService.update(
					payment.customerItem as string,
					{ buyout: buyout }
				);
			})
		);
	}

	public async onCustomerHavePayedChange(customerHavePayed: boolean) {
		this.invoice.customerHavePayed = customerHavePayed;
		this.invoice.toDebtCollection = false;
		this.invoice.toCreditNote = false;
		this.updateInvoiceStatus();
		this.updateCustomerItemsBuyoutStatus(customerHavePayed);
	}

	public onInvoiceToDebtCollection(toDebtCollection: boolean) {
		this.invoice.toDebtCollection = toDebtCollection;
		this.invoice.customerHavePayed = false;
		this.invoice.toCreditNote = false;
		this.updateInvoiceStatus();
	}

	public onInvoiceToCreditNote(toCreditNote: boolean) {
		this.invoice.toCreditNote = toCreditNote;
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
