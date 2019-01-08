import { Injectable } from "@angular/core";
import { BranchStoreService } from "../../branch/branch-store.service";
import { BranchItemStoreService } from "../../branch/branch-item-store/branch-item-store.service";
import { Branch, BranchItem, Item, OrderItemType } from "@wizardcoder/bl-model";
import { Period } from "@wizardcoder/bl-model/dist/period/period";

@Injectable()
export class BranchPriceService {
	private _branchItems: BranchItem[];
	private _branch: Branch;

	constructor(
		private _branchStoreService: BranchStoreService,
		private _branchItemStoreService: BranchItemStoreService
	) {
		this._branchItems = [];
		this.onBranchUpdate();
		this.onBranchItemsUpdate();
	}

	private onBranchUpdate() {
		this._branch = this._branchStoreService.getCurrentBranch();

		this._branchStoreService.onBranchChange().subscribe(() => {
			this._branch = this._branchStoreService.getCurrentBranch();
		});
	}

	private onBranchItemsUpdate() {
		this._branchItems = this._branchItemStoreService.getBranchItems();

		this._branchItemStoreService.onBranchItemsChange().subscribe(() => {
			this._branchItems = this._branchItemStoreService.getBranchItems();
		});
	}

	public rentPrice(
		item: Item,
		period: Period,
		numberOfPeriods: number
	): number {
		this._branchItems = this._branchItemStoreService.getBranchItems();

		if (!this._branch || !this._branch.paymentInfo) {
			return -1;
		}

		if (this._branch.paymentInfo.responsible) {
			return 0;
		}

		if (this.isRentValid(item)) {
			return this.getRentPeriodPrice(item, period, numberOfPeriods);
		}

		return -1;
	}

	public partlyPaymentPrice(
		item: Item,
		period: Period,
		itemAge: "new" | "used"
	): number {
		if (!this._branch || !this._branch.paymentInfo) {
			return -1;
		}

		if (this._branch.paymentInfo.responsible) {
			return 0;
		}

		if (this.isPartlyPaymentValid(item)) {
			return this.getPartlyPaymentUpFrontPrice(item, period, itemAge);
		}
	}

	public getPartlyPaymentBuyoutPrice(
		item: Item,
		periodType: Period,
		itemAge: "new" | "used"
	): number {
		for (const partlyPaymentPeriod of this._branch.paymentInfo
			.partlyPaymentPeriods) {
			if (partlyPaymentPeriod.type === periodType) {
				if (itemAge === "new") {
					return item.price * partlyPaymentPeriod.percentageBuyout;
				}
				if (itemAge === "used") {
					return (
						item.price * partlyPaymentPeriod.percentageBuyoutUsed
					);
				}
			}
		}
		return -1;
	}

	public getPartlyPaymentUpFrontPrice(
		item: Item,
		periodType: Period,
		itemAge: "new" | "used"
	): number {
		for (const partlyPaymentPeriod of this._branch.paymentInfo
			.partlyPaymentPeriods) {
			if (partlyPaymentPeriod.type === periodType) {
				if (itemAge === "new") {
					return item.price * partlyPaymentPeriod.percentageUpFront;
				}

				if (itemAge === "used") {
					return (
						item.price * partlyPaymentPeriod.percentageUpFrontUsed
					);
				}
			}
		}
		return -1;
	}

	private getRentPeriodPrice(
		item: Item,
		periodType: Period,
		numberOfPeriods: number
	): number {
		for (const rentPeriod of this._branch.paymentInfo.rentPeriods) {
			if (
				rentPeriod.type === periodType &&
				rentPeriod.maxNumberOfPeriods >= numberOfPeriods
			) {
				return item.price * rentPeriod.percentage;
			}
		}
		return -1;
	}

	private isPartlyPaymentValid(item: Item) {
		return this.isActionValid(item, "partly-payment");
	}

	private isRentValid(item: Item): boolean {
		return this.isActionValid(item, "rent");
	}

	private isBuyValid(item: Item): boolean {
		return this.isActionValid(item, "buy");
	}

	private isSellValid(item: Item): boolean {
		return this.isActionValid(item, "sell");
	}

	private isActionValid(item: Item, action: OrderItemType): boolean {
		for (const branchItem of this._branchItems) {
			if (branchItem.item === item.id) {
				if (action === "rent") {
					return branchItem.rent;
				} else if (action === "buy") {
					return branchItem.buy;
				} else if (action === "sell") {
					return branchItem.sell;
				}
			}
		}

		return true;
	}
}
