import { Component, Input, OnInit } from "@angular/core";
import { BranchItem, Item } from "@wizardcoder/bl-model";
import { BranchItemService, ItemService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-branch-item-edit",
	templateUrl: "./branch-item-edit.component.html",
	styleUrls: ["./branch-item-edit.component.scss"]
})
export class BranchItemEditComponent implements OnInit {
	@Input() branchItem: BranchItem;
	public item: Item;

	constructor(
		private _itemService: ItemService,
		private _branchItemService: BranchItemService
	) {}

	ngOnInit() {
		this._itemService
			.getById(this.branchItem.item as string)
			.then((item: Item) => {
				this.item = item;
			})
			.catch(getItemError => {
				console.log("BranchItemEditComponent: could not get item");
			});
	}

	onUpdate() {
		this._branchItemService
			.update(this.branchItem.id, this.branchItem)
			.then((updatedBranchItem: BranchItem) => {
				this.branchItem = updatedBranchItem;
			})
			.catch(updateBranchItemError => {
				console.log(
					"branchItemEditComponent: could not update branchItem",
					updateBranchItemError
				);
			});
	}
}
