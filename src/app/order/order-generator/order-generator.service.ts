import { Injectable } from "@angular/core";
import { OrderItem, Order } from "@boklisten/bl-model";
import { BranchStoreService } from "../../branch/branch-store.service";
import { CustomerService } from "../../customer/customer.service";
import { UserService } from "../../user/user.service";

@Injectable({
	providedIn: "root",
})
export class OrderGeneratorService {
	constructor(
		private _branchStoreService: BranchStoreService,
		private _customerService: CustomerService,
		private _userService: UserService
	) {}

	public generateOrder(
		orderItems: OrderItem[],
		customer?: string,
		email?: boolean
	): Order {
		return {
			id: "",
			amount: this.calculateTotalAmount(orderItems),
			orderItems: orderItems,
			branch: this._branchStoreService.getBranchId(),
			customer: customer
				? customer
				: this._customerService.haveCustomer()
				? this._customerService.getCustomerDetailId()
				: null,
			byCustomer: false,
			employee: this._userService.getUserDetailId(),
			viewableFor: customer
				? [customer]
				: [this._customerService.getUserId()],
			placed: false,
			payments: [],
			delivery: null,
			handoutByDelivery: false,
			notification: {
				email: email || false,
			},
			pendingSignature: false,
		};
	}

	private calculateTotalAmount(orderItems: OrderItem[]): number {
		let total = 0;
		for (let orderItem of orderItems) {
			total += orderItem.amount;
		}
		return total;
	}
}
