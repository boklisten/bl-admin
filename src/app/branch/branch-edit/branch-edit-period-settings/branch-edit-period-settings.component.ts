import {Component, Input, OnInit} from '@angular/core';
import {Branch} from '@wizardcoder/bl-model';
import {BranchService} from '@wizardcoder/bl-connect';

@Component({
	selector: 'app-branch-edit-price-info',
	templateUrl: './branch-edit-period-settings.component.html',
	styleUrls: ['./branch-edit-period-settings.component.scss']
})
export class BranchEditPeriodSettingsComponent implements OnInit {

	@Input() branch: Branch;

	constructor(private _branchService: BranchService) {
	}

	ngOnInit() {
	}

	public onRentPeriodDelete(index: number) {
		this.branch.paymentInfo.rentPeriods.splice(index, 1);
		this.onUpdate();
	}

	public onRentPeriodAdd() {
		this.branch.paymentInfo.rentPeriods.push({
			type: 'semester',
			date: new Date(),
			maxNumberOfPeriods: 1,
			percentage: 1
		});
		this.onUpdate();
	}

	public onExtendPeriodDelete(index: number) {
		this.branch.paymentInfo.extendPeriods.splice(index, 1);
		this.onUpdate();
	}

	public onExtendPeriodAdd() {
		this.branch.paymentInfo.extendPeriods.push({
			type: 'semester',
			maxNumberOfPeriods: 1,
			date: new Date(),
			price: 1
		});
		this.onUpdate();
	}

	public onUpdate() {
		this._branchService.update(this.branch.id, this.branch).then((updatedBranch: Branch) => {
			this.branch = updatedBranch;
		}).catch((updateBranchError) => {
			console.log('branchEditPriceInfoComponent: could not update branch');
		});
	}

}
