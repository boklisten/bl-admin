import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
	OrderPdfService,
	OrderService,
	PrintPdfService
} from "@wizardcoder/bl-connect";
import { BlApiError, Order } from "@wizardcoder/bl-model";
import { CustomerService } from "../../customer/customer.service";
import moment from "moment-es6";
import { AuthService } from "../../auth/auth.service";

@Component({
	selector: "app-order-detail",
	templateUrl: "./order-detail.component.html",
	styleUrls: ["./order-detail.component.scss"]
})
export class OrderDetailComponent implements OnInit {
	public currentId: string;
	public warningText: string;
	public wait: boolean;
	public order: Order;
	public isAdmin: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _orderPdfService: OrderPdfService,
		private _pdfPrintService: PrintPdfService,
		private _customerService: CustomerService,
		private _orderService: OrderService,
		private _authService: AuthService
	) {
		this.warningText = null;
		this.wait = false;
	}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this.currentId = params["id"];

			if (this.currentId) {
				this.getOrder(this.currentId);
			}
		});
		this.isAdmin = this._authService.isAdmin();
	}

	public onOrderConfirmed(confirmedOrder: Order) {
		this.order = confirmedOrder;
	}

	public onOrderDeleted() {
		this.getOrder(this.currentId);
	}

	public onPaymentChange() {
		this.getOrder(this.currentId);
	}

	public onReload() {
		this.getOrder(this.currentId);
	}

	private getOrder(id: string) {
		this.warningText = null;
		this.wait = true;
		this._orderService
			.getById(id)
			.then((order: Order) => {
				this.wait = false;
				this.order = order;
			})
			.catch((blApiError: BlApiError) => {
				this.order = null;
				this.warningText = "could not get order";
				this.wait = false;
			});
	}

	printReceipt() {
		this._orderPdfService
			.getOrderReceiptPdf(this.order.id)
			.then(pdfContent => {
				const fileName =
					"ordredetaljer_" +
					moment(this.order.creationTime).format("DDMMYYYY") +
					".pdf";
				this._pdfPrintService.printPdf(pdfContent, fileName);
			})
			.catch(() => {
				console.log("could not get pdf");
			});
	}

	printAgreement() {
		this._orderPdfService
			.getOrderAgreementPdf(this.order.id)
			.then(pdfContent => {
				const fileName =
					"laaneavtale_" +
					moment(this.order.creationTime).format("DDMMYYYY") +
					".pdf";
				this._pdfPrintService.printPdf(pdfContent, fileName);
			})
			.catch(() => {
				console.log("could not get pdf");
			});
	}

	public async showPrintAgreement() {}
}
