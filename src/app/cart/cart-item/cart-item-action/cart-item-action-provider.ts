import { Item, OrderItem, CustomerItem } from "@wizardcoder/bl-model";
import { CartItemAction } from "../cart-item-action";
import { BranchItemHelperService } from "../../../branch/branch-item-helper/branch-item-helper.service";

export class CartItemActionProvider {
	private _item: Item;
	constructor(private _branchItemHelperService: BranchItemHelperService) {}

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

		actions.push({ action: "extend", deadline: new Date() });
		actions.push({ action: "buyout" });
		actions.push({ action: "buyback" });
		actions = actions.concat(this.getValidActionsForCancel());

		return actions;
	}

	public getValidActionsForItem(item: Item): CartItemAction[] {
		this._item = item;
		let actions = [];

		actions = actions.concat(this.getValidActionsForRent());
		actions = actions.concat(this.getValidActionsForPartlyPayment());
		actions = actions.concat(this.getValidActionsForBuy());
		actions = actions.concat(this.getValidActionsForSell());

		return actions;
	}

	private getValidActionsForCancel(): CartItemAction[] {
		return [{ action: "cancel" }];
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
			console.log("rent is valid, semester");
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
