import { Component, HostListener, OnInit } from "@angular/core";
import { BranchStoreService } from "../branch-store.service";
import { Branch, UserPermission } from "@boklisten/bl-model";

import { BlcSortService } from "../../bl-common/blc-sort/blc-sort.service";

enum BranchType {
	Public = "VGS",
	Private = "privatist",
}

@Component({
	selector: "app-branch-current",
	templateUrl: "./branch-current.component.html",
	styleUrls: ["./branch-current.component.scss"],
})
export class BranchCurrentComponent implements OnInit {
	public lastPopoverRef: any;
	public currentBranch: Branch;
	public currentBranchType: BranchType;
	public filteredBranches: Branch[];
	private allBranches: Branch[];

	constructor(
		private _branchStoreService: BranchStoreService,
		private blcSortService: BlcSortService
	) {}

	ngOnInit() {
		if (this._branchStoreService.getCurrentBranch()) {
			this.currentBranch = this._branchStoreService.getCurrentBranch();
			this.currentBranchType = this.currentBranch?.type as BranchType;
		}
		this._branchStoreService
			.onBranchChange()
			.subscribe((branch: Branch) => {
				this.currentBranch = branch;
				this.currentBranchType = this.currentBranch?.type as BranchType;
			});

		this._branchStoreService
			.getAllBranches()
			.then((branches: Branch[]) => {
				this.filteredBranches = this.blcSortService
					.sortByField(branches, "name")
					.filter((branch) => branch.active);
				this.allBranches = this.filteredBranches;
				this.filterBranchesByType(this.currentBranchType);
			})
			.catch((getBranchesError) => {
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

	public toggleBranchType() {
		this.currentBranchType =
			this.currentBranchType === BranchType.Public
				? BranchType.Private
				: BranchType.Public;
		this.onSelectBranchType(this.currentBranchType);
	}

	public onSelectBranch(branch: Branch) {
		this._branchStoreService.setCurrentBranch(branch);
	}

	public onSelectBranchType(branchType: string) {
		this.currentBranchType = branchType as BranchType;
		this.filterBranchesByType(this.currentBranchType);

		if (this.currentBranch?.type !== this.currentBranchType) {
			this.onSelectBranch(this.filteredBranches[0]);
		}
	}

	private filterBranchesByType(branchType: string) {
		this.filteredBranches = this.allBranches.filter(
			(branch) => branch.type === branchType
		);
	}
}
