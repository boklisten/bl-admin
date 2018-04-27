import {Injectable} from '@angular/core';
import {CustomerItem, OrderItem} from '@wizardcoder/bl-model';
import {BranchStoreService} from '../../branch/branch-store.service';
import {UserService} from '../../user/user.service';

@Injectable()
export class CustomerItemHandlerService {

	constructor(private _branchStoreService: BranchStoreService, private _userService: UserService) {
	}

	public addCustomerItemsBasedOnOrderItems(orderItems: OrderItem[]): Promise<CustomerItem[]> {
		const customerItems: CustomerItem[] = [];

		for (const orderItem of orderItems) {
			try {

				customerItems.push(this.convertOrderItemToCustomerItem(orderItem));
			} catch (e) {
				return Promise.reject(e);
			}
		}

		return Promise.resolve(customerItems);
	}

	private convertOrderItemToCustomerItem(orderItem: OrderItem): CustomerItem {
		if (orderItem.type !== 'rent') {
			throw new Error(`can not create customerItem from orderItemType "${orderItem.type}"`);
		}

		const branch = this._branchStoreService.getCurrentBranch();

		return {
			item: orderItem.item,
			deadline: orderItem.info.to,
			handout: true,
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
