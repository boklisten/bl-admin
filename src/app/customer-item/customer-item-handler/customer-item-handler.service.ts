import {Injectable} from '@angular/core';
import {BlApiError, CustomerItem, Order, OrderItem} from '@wizardcoder/bl-model';
import {BranchStoreService} from '../../branch/branch-store.service';
import {UserService} from '../../user/user.service';
import {CustomerItemService} from '@wizardcoder/bl-connect';
import {reject} from 'q';
import {CustomerService} from '../../customer/customer.service';

@Injectable()
export class CustomerItemHandlerService {

	constructor(private _branchStoreService: BranchStoreService, private _userService: UserService, private _customerItemService: CustomerItemService,
	            private _customerService: CustomerService) {
	}

	public updateCustomerItems(orderItems: OrderItem[]): Promise<CustomerItem[]> {
		const updateCustomerItemPromiseArr: Promise<CustomerItem>[] = [];

		for (const orderItem of orderItems) {
			updateCustomerItemPromiseArr.push(this.createCustomerItemPatch(orderItem));
		}

		return new Promise((resolve, reject) => {
			Promise.all(updateCustomerItemPromiseArr).then((customerItems: CustomerItem[]) => {
				resolve(customerItems);
			}).catch((updateCustomerItemsError) => {
				reject(new Error('customerItemHandlerService: could not update customerItems: ' + updateCustomerItemsError));
			});
		});
	}

	public addCustomerItems(orderItemsWithOrder: { orderItem: OrderItem, order: Order }[]): Promise<CustomerItem[]> {
		const customerItems: CustomerItem[] = [];

		for (const orderItemWithOrder of orderItemsWithOrder) {
			if (orderItemWithOrder.orderItem.type === 'rent') {
				customerItems.push(this.convertOrderItemToCustomerItem(orderItemWithOrder.orderItem, orderItemWithOrder.order.customer, orderItemWithOrder.order.id));
			}
		}

		console.log('going to add these customerItems', customerItems);

		if (customerItems.length > 0) {
			return this.addCustomerItemsToApi(customerItems).then((addedCustomerItems: CustomerItem[]) => {
				return addedCustomerItems;
			}).catch((addCustomerItemsError: BlApiError) => {
				throw new Error('customerItemHandlerService: could not add customerItems ' + addCustomerItemsError);
			});
		} else {
			return Promise.reject(Error('customerItemHandlerService: no customerItems to add'));
		}
	}

	private createCustomerItemPatch(orderItem: OrderItem): Promise<CustomerItem> {
		return new Promise((resolve, reject) => {
			this._customerItemService.getById(orderItem.customerItem).then((customerItem: CustomerItem) => {
				const customerItemPatch = this.createCustomerItemPatchByOrderItem(orderItem, customerItem);
				this._customerItemService.update(customerItem.id, customerItemPatch).then((updatedCustomerItem: CustomerItem) => {
					resolve(updatedCustomerItem);
				}).catch((updateCustomerItemError) => {
					reject(new Error('customerItemHandlerService: could not patch customerItems'));
				});
			}).catch(() => {
				reject(new Error('customerItemHandlerService: could not get customerItem'));
			});
		});
	}

	private createCustomerItemPatchByOrderItem(orderItem: OrderItem, customerItem: CustomerItem) {
		if (orderItem.type === 'cancel') {
			return this.createCustomerItemCancelPatch(orderItem, customerItem);
		} else if (orderItem.type === 'extend') {
			return this.createCustomerItemExtendPatch(orderItem, customerItem);
		} else if (orderItem.type === 'return') {
			return this.createCustomerItemReturnPatch(customerItem);
		} else if (orderItem.type === 'buyout') {
			return this.createCustomerItemBuyoutPatch(orderItem, customerItem);
		}
	}

	private createCustomerItemCancelPatch(orderItem: OrderItem, customerITem: CustomerItem): any {
		const branch = this._branchStoreService.getCurrentBranch();
		const userId = this._userService.getUserDetailId();
		return {
			returned: true,
			returnInfo: {
				returnedTo: 'branch',
				returnedToId: branch.id,
				returnEmployee: userId,
				time: new Date()
			}
		};
	}

	private createCustomerItemBuyoutPatch(orderItem: OrderItem, customerItem: CustomerItem): any {
		return {
			buyout: true,
		};
	}

	private createCustomerItemExtendPatch(orderItem: OrderItem, customerItem: CustomerItem): any {
		const periodExtends = (customerItem.periodExtends) ? customerItem.periodExtends : [];

		periodExtends.push({
			from: orderItem.info.from,
			to: orderItem.info.to,
			periodType: orderItem.info.periodType,
			time: new Date()
		});

		return {
			deadline: orderItem.info.to,
			periodExtends: periodExtends
		};

	}

	private createCustomerItemReturnPatch(customerItem: CustomerItem): any {
		const branch = this._branchStoreService.getCurrentBranch();
		const employeeId = this._userService.getUserDetailId();

		return {
			returned: true,
			returnInfo: {
				returnedTo: 'branch',
				returnedToId: branch.id,
				returnEmployee: employeeId,
				time: new Date()
			}
		};
	}

	private addCustomerItemsToApi(customerItems: CustomerItem[]): Promise<CustomerItem[]> {
		const addCustomerItemPromArray: Promise<CustomerItem>[] = [];

		for (const customerItem of customerItems) {
			addCustomerItemPromArray.push(this._customerItemService.add(customerItem));
		}

		return Promise.all(addCustomerItemPromArray);
	}


	private convertOrderItemToCustomerItem(orderItem: OrderItem, customerId: string, orderId: string): CustomerItem {
		const branch = this._branchStoreService.getCurrentBranch();

		return {
			item: orderItem.item,
			customer: customerId,
			deadline: orderItem.info.to,
			handout: true,
			orders: [orderId],
			viewableFor: [this._customerService.getCustomerDetail().blid],
			handoutInfo: {
				handoutBy: 'branch',
				handoutById: branch.id,
				handoutEmployee: this._userService.getUserDetailId(),
				time: new Date()
			},
			returned: false
		} as CustomerItem;
	}

}
