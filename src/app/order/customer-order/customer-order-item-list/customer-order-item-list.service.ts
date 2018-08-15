import {Injectable} from '@angular/core';
import {BranchStoreService} from '../../../branch/branch-store.service';
import {CustomerService} from '../../../customer/customer.service';
import {ItemService, OrderService} from '@wizardcoder/bl-connect';
import {Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {CartService} from '../../../cart/cart.service';

@Injectable({
	providedIn: 'root'
})
export class CustomerOrderItemListService {
	private _customerOrderItems: { orderItem: OrderItem, order: Order, item: Item }[];

	constructor(private _branchStoreService: BranchStoreService,
	            private _orderService: OrderService,
	            private _itemService: ItemService,
	            private _cartService: CartService,
	            private _customerService: CustomerService) {

		this._customerOrderItems = [];
	}

	public getItemWithIsbn(isbn: string) {
		for (const customerOrderItem of this._customerOrderItems) {
			if (customerOrderItem.item.info && customerOrderItem.item.info['isbn']) {
				if (customerOrderItem.item.info['isbn'] === isbn) {
					return customerOrderItem;
				}
			}
		}
	}

	public async addItemWithIsbn(isbn: string): Promise<boolean> {
		if (this._customerOrderItems.length <= 0) {
			await this.getOrderedItems();
		}

		const customerOrderItem = this.getItemWithIsbn(isbn);

		if (customerOrderItem) {
			if (!this._cartService.contains(customerOrderItem.orderItem.item)) {
				this._cartService.addOrderItem(customerOrderItem.orderItem, customerOrderItem.order, customerOrderItem.item);
				return true;
			}
		}

		return false;
	}


	public async getOrderedItems(): Promise<{ orderItem: OrderItem, order: Order, item: Item }[]> {
		this._customerOrderItems = [];

		const customerDetail = this._customerService.getCustomerDetail();

		const orders = await this._orderService.getManyByIds(customerDetail.orders);

		for (const order of orders) {
			for (const orderItem of order.orderItems) {
				await this.addAsOrderedItem(order, orderItem);
			}
		}

		return this._customerOrderItems;
	}

	private async addAsOrderedItem(order: Order, orderItem: OrderItem): Promise<boolean> {
		if (order.handoutByDelivery || !order.byCustomer) {
			return false;
		}

		if (orderItem.handout) {
			return false;
		}

		if (orderItem.movedToOrder) {
			return false;
		}

		if (orderItem.type === 'rent' || orderItem.type === 'buy') {
			const item = await this._itemService.getById(orderItem.item);
			this._customerOrderItems.push({order: order, orderItem: orderItem, item: item});
			return true;
		}

		return false;

	}
}
