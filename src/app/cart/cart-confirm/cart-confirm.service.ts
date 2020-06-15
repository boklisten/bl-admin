import { Injectable } from "@angular/core";
import { OrderHandlerService } from "../../order/order-handler/order-handler.service";
import {
	CustomerItem,
	Delivery,
	Order,
	OrderItem
} from "@wizardcoder/bl-model";
import { CartService } from "../cart.service";
import { CustomerItemHandlerService } from "../../customer-item/customer-item-handler/customer-item-handler.service";
import { forEach } from "@angular/router/src/utils/collection";
import { CartItem } from "../cart-item/cart-item";
import { CustomerService } from "../../customer/customer.service";
import { PaymentHandlerService } from "../../payment/payment-handler/payment-handler.service";
import { DeliveryService } from "@wizardcoder/bl-connect";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class CartConfirmService {
	constructor(
		private _orderHandlerService: OrderHandlerService,
		private _cartService: CartService,
		private _customerItemHandlerService: CustomerItemHandlerService,
		private _customerService: CustomerService,
		private _deliveryService: DeliveryService,
		private _paymentHandlerService: PaymentHandlerService
	) {}

	public async addOrder(order: Order): Promise<Order> {
		return this._orderHandlerService.addOrder(
			order,
			await this.orderShouldHaveDelivery(),
			this._cartService.getNotificationSettings()
		);
	}

	public placeOrder(order: Order): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (order.amount !== 0) {
				this._paymentHandlerService
					.addPayments(order)
					.then(() => {
						this._orderHandlerService
							.placeOrder(order)
							.then(() => {
								resolve(true);
							})
							.catch(placeOrderError => {
								reject(
									new Error(
										"cartConfirmService: could not place order" +
											placeOrderError
									)
								);
							});
					})
					.catch(addPaymentError => {
						reject(
							new Error(
								"cartConfirmService: could not add payments: " +
									addPaymentError
							)
						);
					});
			} else {
				this._orderHandlerService
					.placeOrder(order)
					.then(() => {
						resolve(true);
					})
					.catch(placeOrderError => {
						console.log(
							"cartConfirmService: could not place order: " +
								placeOrderError
						);
					});
			}
		});
	}

	public async orderShouldHaveDelivery() {
		/*
		for (const cartItem of this._cartService.getCart()) {
			if (cartItem.originalOrder && cartItem.originalOrder.delivery) {
				const delivery = await this._deliveryService.getById(cartItem
					.originalOrder.delivery as string);
				if (delivery.method !== "bring") {
					return false;
				}
			} else {
				return false;
			}
		}
    */

		return true;
	}
	public async getOriginalDelivery(): Promise<Delivery> {
		for (const cartItem of this._cartService.getCart()) {
			if (cartItem.originalOrder && cartItem.originalOrder.delivery) {
				const delivery = await this._deliveryService.getById(cartItem
					.originalOrder.delivery as string);
				if (delivery.method === "bring") {
					return delivery;
				}
			}
		}

		throw new Error("could not find original delivery");
	}

	public async addOrUpdateCustomerItems(order: Order): Promise<boolean> {
		const customerItemsToCreate: {
			order: Order;
			orderItem: OrderItem;
		}[] = [];
		const orderItemsToUpdate: OrderItem[] = [];

		if (order) {
			for (const orderItem of order.orderItems) {
				if (
					!orderItem.customerItem &&
					orderItem.type !== "buy" &&
					orderItem.type !== "sell" &&
					orderItem.type !== "buyout" &&
					orderItem.type !== "cancel"
				) {
					customerItemsToCreate.push({
						orderItem: orderItem,
						order: order
					});
				} else if (orderItem.customerItem) {
					orderItemsToUpdate.push(orderItem);
				}
			}
		}

		try {
			if (orderItemsToUpdate.length > 0) {
				await this._customerItemHandlerService.updateCustomerItems(
					orderItemsToUpdate
				);
			}

			if (customerItemsToCreate.length > 0) {
				await this._customerItemHandlerService.addCustomerItems(
					customerItemsToCreate
				);
			}
		} catch (e) {
			throw new Error("could not add or update customerItems: " + e);
		}

		return true;
	}
}
