import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { Branch, BranchItem, Item } from "@wizardcoder/bl-model";
import {
	NgbActiveModal,
	NgbModal,
	NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { BranchItemHandlerService } from "../../branch-item/branch-item-handler.service";
import { BranchItemService } from "@wizardcoder/bl-connect";
import { BranchItemStoreService } from "../../branch-item-store/branch-item-store.service";

@Component({
	selector: "app-branch-edit-items",
	templateUrl: "./branch-edit-items.component.html",
	styleUrls: ["./branch-edit-items.component.scss"]
})
export class BranchEditItemsComponent implements OnInit {
	@Input() branch: Branch;
	@Output() branchChange: EventEmitter<Branch>;
	public branchItems: BranchItem[];
	public selectedItems: Item[];
	private modalRef: NgbModalRef;

	constructor(
		private _modalService: NgbModal,
		private _branchItemHandlerService: BranchItemHandlerService,
		private _branchItemService: BranchItemService,
		private _branchItemStoreService: BranchItemStoreService
	) {
		this.branchChange = new EventEmitter<Branch>();
		this.selectedItems = [];
		this.branchItems = [];
	}

	ngOnInit() {
		if (!this.branch.isBranchItemsLive) {
			this.branch.isBranchItemsLive = {
				online: false,
				atBranch: false
			};
			this.onBranchItemsLiveUpdate();
		}

		//this.branchItems = this._branchItemStoreService.getBranchItems();

		//this._branchItemService
		//.getManyByIds(this.branch.branchItems as string[])
		//.then((branchItems: BranchItem[]) => {
		//this.branchItems = branchItems;
		//})
		//.catch(getBranchItemsError => {
		//console.log(
		//"BranchEditItemsComponent: could not get branchItems"
		//);
		//});
		//
		this.getBranchItems();
	}

	private getBranchItems() {
		this._branchItemService
			.get({ query: "?branch=" + this.branch.id })
			.then(branchItems => {
				this.branchItems = branchItems;
			})
			.catch(() => {});
	}

	onBranchItemsLiveUpdate() {
		this.branchChange.emit(this.branch);
	}

	onSelectedItems(selectedItems: Item[]) {
		this.selectedItems = selectedItems;
	}

	openAddItems(content) {
		this.modalRef = this._modalService.open(content, {
			size: "lg",
			centered: true
		});
	}

	onAddSelectedItems() {
		this._branchItemHandlerService
			.addItemsToBranch(this.selectedItems, this.branch)
			.then((branchItems: BranchItem[]) => {
				this.branchItems = branchItems;
				this.modalRef.close();
			})
			.catch(addBranchItemsError => {
				console.log(
					"branchEditItemsComponent: could not add branchItems",
					addBranchItemsError
				);
			});
	}

	public onRemoveItem(index: number) {
		this._branchItemService
			.remove(this.branchItems[index].id)
			.then(() => {
				this.branchItems.splice(index, 1);
			})
			.catch(removeBranchItemError => {
				console.log(
					"branchEditItemsComponent: could not remove branchItem from branch",
					removeBranchItemError
				);
			});
	}
}
