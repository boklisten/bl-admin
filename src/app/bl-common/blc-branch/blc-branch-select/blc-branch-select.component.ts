import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { BranchService } from "@boklisten/bl-connect";
import { Branch } from "@boklisten/bl-model";

@Component({
	selector: "app-blc-branch-select",
	templateUrl: "./blc-branch-select.component.html",
	styleUrls: ["./blc-branch-select.component.scss"],
})
export class BlcBranchSelectComponent implements OnInit {
	public branches: Branch[];
	public selectedBranches: string[];
	public custom: boolean;
	@Output() selectBranches: EventEmitter<string[]>;

	constructor(private branchService: BranchService) {
		this.custom = false;
		this.branches = [];
		this.selectedBranches = [];
		this.selectBranches = new EventEmitter<string[]>();
	}

	ngOnInit() {
		this.branchService
			.get()
			.then((branches: Branch[]) => {
				this.branches = branches;
				this.selectAll();
			})
			.catch(() => {
				console.log("could not get branches");
			});
	}

	public onCustom() {
		this.deselectAll();
		this.custom = true;
	}

	public onAll() {
		this.selectAll();
		this.custom = false;
	}

	public toggle(branchId: string) {
		if (this.contains(branchId)) {
			let index = this.selectedBranches.indexOf(branchId);
			this.selectedBranches.splice(index, 1);
		} else {
			this.selectedBranches.push(branchId);
		}

		this.selectBranches.emit(this.selectedBranches);
	}

	public selectAll() {
		this.branches.forEach((b) => this.selectedBranches.push(b.id));
	}

	public deselectAll() {
		this.selectedBranches = [];
	}

	public contains(branchId: string): boolean {
		return this.selectedBranches.indexOf(branchId) >= 0;
	}
}
