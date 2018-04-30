import {Injectable} from '@angular/core';
import {BlApiError, CustomerItem, OrderItem} from '@wizardcoder/bl-model';
import {BranchStoreService} from '../../branch/branch-store.service';
import {UserService} from '../../user/user.service';
import {CustomerItemService} from '@wizardcoder/bl-connect';
import {reject} from 'q';

@Injectable()
export class CustomerItemHandlerService {

	constructor(private _branchStoreService: BranchStoreService, private _userService: UserService, private _customerItemService: CustomerItemService) {
	}

	public addCustomerItemsBasedOnOrderItems(orderItemsWithOrderId: {orderItem: OrderItem, orderId: string}[], customerId: string): Promise<CustomerItem[]> {
		const customerItems: CustomerItem[] = [];

		for (const orderItemWithOrderId of orderItemsWithOrderId) {
			if (orderItemWithOrderId.orderItem.type === 'rent') {
				customerItems.push(this.convertOrderItemToCustomerItem(orderItemWithOrderId.orderItem, customerId, orderItemWithOrderId.orderId));
			}
		}

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
