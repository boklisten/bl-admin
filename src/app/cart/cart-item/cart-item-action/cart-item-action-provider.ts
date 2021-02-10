import { Item, OrderItem, CustomerItem } from "@boklisten/bl-model";
import { CartItemAction } from "../cart-item-action";
import { BranchItemHelperService } from "../../../branch/branch-item-helper/branch-item-helper.service";
import { BranchHelperService } from "../../../branch/branch-helper/branch-helper.service";
import { DateService } from "../../../date/date.service";
import { CustomerService } from "../../../customer/customer.service";
import { AuthService } from "../../../auth/auth.service";

export class CartItemActionProvider {
	private _item: Item;
	constructor(
		private _branchItemHelperService: BranchItemHelperService,
		private _branchHelperService: BranchHelperService,
		private _dateService: DateService,
		private _customerService: CustomerService,
		private _authService: AuthService
	) {}

	public selectDefaultActionForCustomerItem(
		validActions: CartItemAction[],
		customerItem: CustomerItem
	): CartItemAction {
		if (
			this._dateService.isCustomerItemCancelValid(
				customerItem.handoutInfo.time
			)
		) {
			for (let validAction of validActions) {
				if (validAction.action === "cancel") {
					return validAction;
				}
			}
		}

		return validActions[0];
	}

	public getValidActionsForOrderItem(
		orderItem: OrderItem,
		item: Item
	): CartItemAction[] {
		this._item = item;
		let actions: CartItemAction[] = [];

		actions = actions.concat(this.getValidActionsForRent());
		actions = actions.concat(this.getValidActionsForPartlyPayment());
		actions = actions.concat(this.getValidActionsForBuy());
		actions = actions.concat(this.getValidActionsForCancel());

		return actions;
	}

	public getValidActionsForCustomerItem(
		customerItem: CustomerItem,
		item: Item
	): CartItemAction[] {
		this._item = item;
		let actions = [];

		actions = actions.concat(this.getValidActionsForReturn(customerItem));
		actions = actions.concat(this.getValidActionsForBuyback(customerItem));
		actions = actions.concat(this.getValidActionsForExtend(customerItem));
		actions = actions.concat(this.getValidActionsForBuyout(customerItem));
		actions = actions.concat(
			this.getValidActionsForCustomerItemCancel(customerItem)
		);

		return actions;
	}

	public getValidActionsForItem(item: Item): CartItemAction[] {
		this._item = item;
		let actions = [];

		if (this._customerService.haveCustomer()) {
			actions = actions.concat(this.getValidActionsForRent());
			actions = actions.concat(this.getValidActionsForPartlyPayment());
			actions = actions.concat(this.getValidActionsForBuy());
			actions = actions.concat(this.getValidActionsForSell());
		} else {
			actions = actions.concat(this.getValidActionsForBuy());
		}

		return actions;
	}

	private getValidActionsForBuyback(
		customerItem: CustomerItem
	): CartItemAction[] {
		if (this.isBuybackValid(customerItem)) {
			return [{ action: "buyback" }];
		}

		return [];
	}

	private isBuybackValid(customerItem: CustomerItem): boolean {
		return (
			customerItem.type == "partly-payment" &&
			((!this._dateService.isCustomerItemCancelValid(
				customerItem.handoutInfo.time
			) &&
				!this._dateService.isDeadlineExpired(customerItem.deadline) &&
				this._item.buyback) ||
				this._authService.isAdmin())
		);
	}

	private getValidActionsForBuyout(
		customerItem: CustomerItem
	): CartItemAction[] {
		if (
			!this._dateService.isDeadlineExpired(customerItem.deadline) ||
			this._authService.isAdmin()
		) {
			return [{ action: "buyout" }];
		}
		return [];
	}

	private getValidActionsForReturn(
		customerItem: CustomerItem
	): CartItemAction[] {
		if (this.isRentValid(customerItem)) {
			return [{ action: "return" }];
		}
		return [];
	}

	private isRentValid(customerItem: CustomerItem): boolean {
		return (
			customerItem.type === "rent" &&
			(!this._dateService.isDeadlineExpired(customerItem.deadline) ||
				this._authService.isAdmin())
		);
	}

	private getValidActionsForCustomerItemCancel(
		customerItem: CustomerItem
	): CartItemAction[] {
		if (this.isCustomerItemCancelValid(customerItem)) {
			return [{ action: "cancel" }];
		}
		return [];
	}

	private getValidActionsForCancel(): CartItemAction[] {
		return [{ action: "cancel" }];
	}

	private getValidActionsForExtend(
		customerItem: CustomerItem
	): CartItemAction[] {
		if (
			this._dateService.isDeadlineExpired(customerItem.deadline) &&
			!this._authService.isAdmin()
		) {
			return [];
		}

		let actions = [];

		try {
			const semesterExtendPeriod = this._branchHelperService.getExtendPeriod(
				"semester"
			);

			actions.push({
				action: "extend",
				period: "semester",
				deadline: semesterExtendPeriod.date
			});
		} catch (e) {}

		try {
			const yearExtendPeriod = this._branchHelperService.getExtendPeriod(
				"year"
			);

			actions.push({
				action: "extend",
				period: "semester",
				deadline: yearExtendPeriod.date
			});
		} catch (e) {}

		return actions;
	}

	private isCustomerItemCancelValid(customerItem: CustomerItem): boolean {
		return (
			(customerItem.handout &&
				this._dateService.isCustomerItemCancelValid(
					customerItem.handoutInfo.time
				) &&
				!this._dateService.isDeadlineExpired(customerItem.deadline)) ||
			this._authService.isAdmin()
		);
	}

	private getValidActionsForBuy(): CartItemAction[] {
		if (this._branchItemHelperService.isBuyValid(this._item)) {
			return [{ action: "buy" }];
		}
		return [];
	}

	private getValidActionsForSell(): CartItemAction[] {
		if (this._branchItemHelperService.isSellValid(this._item)) {
			return [{ action: "sell" }];
		}
		return [];
	}

	private getValidActionsForPartlyPayment(): CartItemAction[] {
		const actions = [];
		if (
			this._branchItemHelperService.isPartlyPaymentValid(
				this._item,
				"semester"
			)
		) {
			actions.push({
				action: "partly-payment",
				period: "semester",
				age: "new",
				deadline: this._branchItemHelperService.getDeadlineForPartlyPaymentPeriod(
					"semester"
				)
			});
		}

		if (
			this._branchItemHelperService.isPartlyPaymentValid(
				this._item,
				"year"
			)
		) {
			actions.push({
				action: "partly-payment",
				period: "year",
				age: "new",
				deadline: this._branchItemHelperService.getDeadlineForPartlyPaymentPeriod(
					"year"
				)
			});
		}
		return actions;
	}

	private getValidActionsForRent(): CartItemAction[] {
		const actions = [];
		if (this._branchItemHelperService.isRentValid(this._item, "semester")) {
			actions.push({
				action: "rent",
				period: "semester",
				deadline: this._branchItemHelperService.getDeadlineForRentPeriod(
					"semester"
				)
			});
		}

		if (this._branchItemHelperService.isRentValid(this._item, "year")) {
			actions.push({
				action: "rent",
				period: "year",
				deadline: this._branchItemHelperService.getDeadlineForRentPeriod(
					"year"
				)
			});
		}
		return actions;
	}
}
