import { Injectable } from "@angular/core";
import {
	BlApiError,
	CustomerItem,
	Order,
	OrderItem
} from "@wizardcoder/bl-model";
import { BranchStoreService } from "../../branch/branch-store.service";
import { UserService } from "../../user/user.service";
import { CustomerItemService } from "@wizardcoder/bl-connect";
import { reject } from "q";
import { CustomerService } from "../../customer/customer.service";
import { DateService } from "../../date/date.service";

@Injectable()
export class CustomerItemHandlerService {
	constructor(
		private _branchStoreService: BranchStoreService,
		private _userService: UserService,
		private _customerItemService: CustomerItemService,
		private _customerService: CustomerService,
		private _dateService: DateService
	) {}

	public async updateCustomerItems(
		orderItems: OrderItem[]
	): Promise<CustomerItem[]> {
		const customerItems: CustomerItem[] = [];

		try {
			for (const orderItem of orderItems) {
				const customerItem = await this.createCustomerItemPatch(
					orderItem
				);
				customerItems.push(customerItem);
			}
		} catch (e) {
			throw new Error("could not update customerItems: " + e);
		}

		return customerItems;
	}

	public async addCustomerItems(
		orderItemsWithOrder: { orderItem: OrderItem; order: Order }[]
	): Promise<CustomerItem[]> {
		const customerItems: CustomerItem[] = [];

		for (const orderItemWithOrder of orderItemsWithOrder) {
			if (
				orderItemWithOrder.orderItem.type === "rent" ||
				orderItemWithOrder.orderItem.type === "partly-payment"
			) {
				const customerItem = this.convertOrderItemToCustomerItem(
					orderItemWithOrder.orderItem,
					orderItemWithOrder.order.customer as string,
					orderItemWithOrder.order.id
				);
				customerItems.push(customerItem);
			}
		}

		if (customerItems.length <= 0) {
			throw new Error(
				"customerItemHandlerService: no customerItems to add"
			);
		}

		try {
			return await this.addCustomerItemsToApi(customerItems);
		} catch (e) {
			throw new Error(
				"customerItemHandlerService: could not add customer items: " + e
			);
		}
	}

	public getNotReturned(period: {
		fromDate: Date;
		toDate: Date;
	}): Promise<CustomerItem[]> {
		const fromDate = this._dateService.dateOnApiFormat(period.fromDate);
		const toDate = this._dateService.dateOnApiFormat(period.toDate);

		return this._customerItemService.get(
			`?deadline=>${fromDate}&deadline=<${toDate}&returned=false&buyout=false`
		);
	}

	private createCustomerItemPatch(
		orderItem: OrderItem
	): Promise<CustomerItem> {
		return new Promise((resolve, reject) => {
			this._customerItemService
				.getById(orderItem.customerItem as string)
				.then((customerItem: CustomerItem) => {
					const customerItemPatch = this.createCustomerItemPatchByOrderItem(
						orderItem,
						customerItem
					);
					this._customerItemService
						.update(customerItem.id, customerItemPatch)
						.then((updatedCustomerItem: CustomerItem) => {
							resolve(updatedCustomerItem);
						})
						.catch(updateCustomerItemError => {
							reject(
								new Error(
									"customerItemHandlerService: could not patch customerItems"
								)
							);
						});
				})
				.catch(() => {
					reject(
						new Error(
							"customerItemHandlerService: could not get customerItem"
						)
					);
				});
		});
	}

	private createCustomerItemPatchByOrderItem(
		orderItem: OrderItem,
		customerItem: CustomerItem
	) {
		if (orderItem.type === "cancel") {
			return this.createCustomerItemCancelPatch(orderItem, customerItem);
		} else if (orderItem.type === "extend") {
			return this.createCustomerItemExtendPatch(orderItem, customerItem);
		} else if (orderItem.type === "return") {
			return this.createCustomerItemReturnPatch(customerItem);
		} else if (orderItem.type === "buyout") {
			return this.createCustomerItemBuyoutPatch(orderItem, customerItem);
		}
	}

	private createCustomerItemCancelPatch(
		orderItem: OrderItem,
		customerITem: CustomerItem
	): any {
		const branch = this._branchStoreService.getCurrentBranch();
		const userId = this._userService.getUserDetailId();
		return {
			returned: true,
			returnInfo: {
				returnedTo: "branch",
				returnedToId: branch.id,
				returnEmployee: userId,
				time: new Date()
			}
		};
	}

	private createCustomerItemBuyoutPatch(
		orderItem: OrderItem,
		customerItem: CustomerItem
	): any {
		return {
			buyout: true
		};
	}

	private createCustomerItemExtendPatch(
		orderItem: OrderItem,
		customerItem: CustomerItem
	): any {
		const periodExtends = customerItem.periodExtends
			? customerItem.periodExtends
			: [];

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
				returnedTo: "branch",
				returnedToId: branch.id,
				returnEmployee: employeeId,
				time: new Date()
			}
		};
	}

	private async addCustomerItemsToApi(
		customerItems: CustomerItem[]
	): Promise<CustomerItem[]> {
		const addedCustomerItems: CustomerItem[] = [];

		try {
			for (const customerItem of customerItems) {
				const addedCustomerItem = await this._customerItemService.add(
					customerItem
				);
				addedCustomerItems.push(addedCustomerItem);
			}
		} catch (e) {
			throw new Error(
				"customerItemHandlerService: could not add customer item: " + e
			);
		}

		return addedCustomerItems;
	}

	private convertOrderItemToCustomerItem(
		orderItem: OrderItem,
		customerId: string,
		orderId: string
	): CustomerItem {
		const branch = this._branchStoreService.getCurrentBranch();
		const customerDetail = this._customerService.getCustomerDetail();

		return {
			id: null,
			item: orderItem.item,
			type:
				orderItem.type === "rent" || orderItem.type === "partly-payment"
					? orderItem.type
					: null,
			customer: customerId,
			deadline: orderItem.info.to,
			handout: true,
			orders: [orderId],
			viewableFor: [this._customerService.getCustomerDetail().blid],
			handoutInfo: {
				handoutBy: "branch",
				handoutById: branch.id,
				handoutEmployee: this._userService.getUserDetailId(),
				time: new Date()
			},
			amountLeftToPay:
				orderItem.type === "partly-payment"
					? orderItem.info["amountLeftToPay"]
					: null,
			totalAmount:
				orderItem.type === "partly-payment"
					? orderItem.amount + orderItem.info["amountLeftToPay"]
					: null,
			customerInfo: {
				name: customerDetail.name,
				phone: customerDetail.phone,
				address: customerDetail.address,
				postCode: customerDetail.postCode,
				postCity: customerDetail.postCity,
				dob: customerDetail.dob,
				guardian: {
					name: customerDetail.guardian
						? customerDetail.guardian.name
						: null,
					phone: customerDetail.guardian
						? customerDetail.guardian.phone
						: null,
					email: customerDetail.guardian
						? customerDetail.guardian.email
						: null
				}
			},
			returned: false
		} as CustomerItem;
	}
}
