import { Component, HostListener, OnInit } from "@angular/core";
import { BranchStoreService } from "../branch-store.service";
import { Branch, UserPermission } from "@wizardcoder/bl-model";

import { BlcSortService } from "../../bl-common/blc-sort/blc-sort.service";

@Component({
	selector: "app-branch-current",
	templateUrl: "./branch-current.component.html",
	styleUrls: ["./branch-current.component.scss"]
})
export class BranchCurrentComponent implements OnInit {
	public lastPopoverRef: any;
	public currentBranch: Branch;
	public branches: Branch[];

	constructor(
		private _branchStoreService: BranchStoreService,
		private blcSortService: BlcSortService
	) {}

	ngOnInit() {
		if (this._branchStoreService.getCurrentBranch()) {
			this.currentBranch = this._branchStoreService.getCurrentBranch();
		}
		this._branchStoreService
			.onBranchChange()
			.subscribe((branch: Branch) => {
				this.currentBranch = branch;
			});

		this._branchStoreService
			.getAllBranches()
			.then((branches: Branch[]) => {
				this.branches = this.blcSortService.sortByField(
					branches,
					"name"
				);
			})
			.catch(getBranchesError => {
				console.log(
					"HeaderComponent: could not get branches",
					getBranchesError
				);
			});
	}

	@HostListener("document:click", ["$event"])
	clickOutside(event) {
		// If there's a last element-reference AND the click-event target is outside this element
		if (this.lastPopoverRef && this.lastPopoverRef._elementRef) {
			if (
				!this.lastPopoverRef._elementRef.nativeElement.contains(
					event.target
				)
			) {
				this.lastPopoverRef.close();
				this.lastPopoverRef = null;
			}
		}
	}

	setCurrentPopoverOpen(popReference) {
		// If there's a last element-reference AND the new reference is different
		if (this.lastPopoverRef && this.lastPopoverRef !== popReference) {
			this.lastPopoverRef.close();
		}
		// Registering new popover ref
		this.lastPopoverRef = popReference;
	}

	public onSelectBranch(branch: Branch) {
		this._branchStoreService.setCurrentBranch(branch);
	}
}
