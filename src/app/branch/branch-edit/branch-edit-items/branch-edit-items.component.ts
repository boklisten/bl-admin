import {Component, Input, OnInit} from '@angular/core';
import {Branch, BranchItem, Item} from '@wizardcoder/bl-model';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BranchItemHandlerService} from '../../branch-item/branch-item-handler.service';
import {BranchItemService} from '@wizardcoder/bl-connect';

@Component({
	selector: 'app-branch-edit-items',
	templateUrl: './branch-edit-items.component.html',
	styleUrls: ['./branch-edit-items.component.scss']
})
export class BranchEditItemsComponent implements OnInit {
	@Input() branch: Branch;
	public branchItems: BranchItem[];
	public selectedItems: Item[];
	private modalRef: NgbModalRef;

	constructor(private _modalService: NgbModal, private _branchItemHandlerService: BranchItemHandlerService, private _branchItemService: BranchItemService) {
		this.selectedItems = [];
		this.branchItems = [];
	}

	ngOnInit() {
		this._branchItemService.getManyByIds(this.branch.branchItems).then((branchItems: BranchItem[]) => {
			this.branchItems = branchItems;
		}).catch((getBranchItemsError) => {
			console.log('BranchEditItemsComponent: could not get branchItems');
		});
	}

	onSelectedItems(selectedItems: Item[]) {
		this.selectedItems = selectedItems;
	}

	openAddItems(content) {
		this.modalRef = this._modalService.open(content, {size: 'lg', centered: true});
	}

	onAddSelectedItems() {
		this._branchItemHandlerService.addItemsToBranch(this.selectedItems, this.branch).then((branchItems: BranchItem[]) => {

			this.branchItems = branchItems;
			this.modalRef.close();
		}).catch((addBranchItemsError) => {
			console.log('branchEditItemsComponent: could not add branchItems', addBranchItemsError);
		});
	}

}
