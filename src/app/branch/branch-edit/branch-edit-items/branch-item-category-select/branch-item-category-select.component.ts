import { Component, Input, OnInit } from "@angular/core";
import { BranchItem } from "@boklisten/bl-model";
import { BranchItemCategorySelectService } from "./branch-item-category-select.service";
import { BranchItemService } from "@boklisten/bl-connect";

@Component({
	selector: "app-branch-item-category-select",
	templateUrl: "./branch-item-category-select.component.html",
	styleUrls: ["./branch-item-category-select.component.scss"],
})
export class BranchItemCategorySelectComponent implements OnInit {
	@Input() branchItem: BranchItem;
	public categories: string[];
	public availableCategories: string[];
	public categoryName: string;

	constructor(
		private _branchItemCategorySelectService: BranchItemCategorySelectService,
		private _branchItemService: BranchItemService
	) {
		this.categoryName = "";
		this.categories = [];
		this.availableCategories = [];
	}

	ngOnInit() {
		this.categories = this.branchItem.categories;
		for (const category of this.categories) {
			this._branchItemCategorySelectService.add(category);
		}

		this.availableCategories = this._branchItemCategorySelectService
			.getCategories()
			.sort((a, b) => a.localeCompare(b));
	}

	onAddCategory() {
		this._branchItemCategorySelectService.add(this.categoryName);
		this.onSelectCategory(this.categoryName);
		this.categoryName = "";
	}

	onRemoveCategory(index: number) {
		this.categories.splice(index, 1);
		this.updateBranchItem();
	}

	isCategorySelected(name: string) {
		return this.categories.indexOf(name) >= 0;
	}

	onSelectCategory(name: string) {
		if (this.categories.indexOf(name) >= 0) {
			this.categories.splice(this.categories.indexOf(name), 1);
		} else {
			this.categories.push(name);
			this.categories = this.categories.sort((a, b) =>
				a.localeCompare(b)
			);
		}
		this.updateBranchItem();
	}

	updateBranchItem() {
		this._branchItemService
			.update(this.branchItem.id, { categories: this.categories })
			.then((updatedBranchItem: BranchItem) => {
				this.branchItem = updatedBranchItem;
			})
			.catch((updateBranchItemError) => {
				console.log(
					"BranchItemCategorySelectComponent: could not update branchItem",
					updateBranchItemError
				);
			});
	}
}
