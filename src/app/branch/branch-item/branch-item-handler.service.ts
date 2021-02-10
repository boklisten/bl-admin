import { Injectable } from "@angular/core";
import { Branch, BranchItem, Item } from "@boklisten/bl-model";
import { BranchItemService, BranchService } from "@boklisten/bl-connect";

@Injectable()
export class BranchItemHandlerService {
	constructor(
		private _branchItemService: BranchItemService,
		private _branchService: BranchService
	) {}

	public async addItemsToBranch(
		items: Item[],
		branch: Branch
	): Promise<BranchItem[]> {
		const branchItemAddPromArray: Promise<BranchItem>[] = [];

		try {
			const itemsToAdd = await this.takeOutDuplicateItems(branch, items);

			for (const item of itemsToAdd) {
				branchItemAddPromArray.push(
					this._branchItemService.add(
						this.createDefaultBranchItem(item.id, branch.id)
					)
				);
			}

			const branchItems = await Promise.all(branchItemAddPromArray);

			return await this.addBranchItemsToBranch(branch, branchItems);
		} catch (e) {
			throw new Error(
				"branchItemHandlerService: could not add items to branch: " + e
			);
		}
	}

	public removeItemFromBranch(
		branchItem: BranchItem,
		branch: Branch
	): Promise<string[]> {
		for (let i = 0; i < branch.branchItems.length; i++) {
			if (branch.branchItems[i] === branchItem.id) {
				branch.branchItems.splice(i, 1);
			}
		}

		return this._branchService
			.update(branch.id, { branchItems: branch.branchItems as string[] })
			.then((updatedBranch: Branch) => {
				return updatedBranch.branchItems as string[];
			})
			.catch(updateBranchError => {
				throw new Error(
					"branchItemHandlerService: could not update branch when deleting branchItem"
				);
			});
	}

	private takeOutDuplicateItems(
		branch: Branch,
		itemsToAdd: Item[]
	): Promise<Item[]> {
		// if the item id already is in the branch.branchItems, no need to add them again
		return this._branchItemService
			.getManyByIds(branch.branchItems as string[])
			.then((branchItems: BranchItem[]) => {
				return itemsToAdd.filter((item: Item) => {
					for (const branchItem of branchItems) {
						if (item.id === branchItem.item) {
							return false;
						}
					}
					return true;
				});
			})
			.catch(getBranchItems => {
				throw new Error("branchItemHandler: could not get branchItems");
			});
	}

	private addBranchItemsToBranch(
		branch: Branch,
		branchItems: BranchItem[]
	): Promise<BranchItem[]> {
		return new Promise((resolve, reject) => {
			const branchItemIds: string[] = branch.branchItems
				? (branch.branchItems as string[])
				: [];

			branchItems.forEach((branchItem: BranchItem) => {
				branchItemIds.push(branchItem.id);
			});

			this._branchService
				.update(branch.id, { branchItems: branchItemIds })
				.then((updatedBranch: Branch) => {
					this.getBranchItems(branch.id)
						.then(branchItems => {
							resolve(branchItems);
						})
						.catch(e => {
							reject(e);
						});
				})
				.catch(updateBranchError => {
					reject(
						new Error(
							"branchItemHandlerService: could not update branch with branchItems" +
								updateBranchError
						)
					);
				});
		});
	}

	private getBranchItems(branchId: string): Promise<BranchItem[]> {
		return new Promise((resolve, reject) => {
			this._branchItemService
				.get({ query: "?branch=" + branchId })
				.then((updatedBranchItems: BranchItem[]) => {
					resolve(updatedBranchItems);
				})
				.catch(getBranchItemError => {
					reject(
						new Error(
							"branchItemHandlerService: could not get the updated branchItems"
						)
					);
				});
		});
	}

	private createDefaultBranchItem(
		itemId: string,
		branchId: string
	): BranchItem {
		return {
			item: itemId,
			branch: branchId,
			sell: false,
			buy: false,
			rent: false
		} as any;
	}
}
