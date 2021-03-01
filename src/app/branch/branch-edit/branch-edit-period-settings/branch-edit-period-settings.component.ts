import { Component, Input, OnInit } from "@angular/core";
import { Branch } from "@boklisten/bl-model";
import { BranchService } from "@boklisten/bl-connect";

@Component({
	selector: "app-branch-edit-price-info",
	templateUrl: "./branch-edit-period-settings.component.html",
	styleUrls: ["./branch-edit-period-settings.component.scss"],
})
export class BranchEditPeriodSettingsComponent implements OnInit {
	@Input() branch: Branch;

	constructor(private _branchService: BranchService) {}

	ngOnInit() {
		this.branch.paymentInfo.partlyPaymentPeriods = this.branch.paymentInfo
			.partlyPaymentPeriods
			? this.branch.paymentInfo.partlyPaymentPeriods
			: ([] as any);
		this.branch.paymentInfo.rentPeriods = this.branch.paymentInfo
			.rentPeriods
			? this.branch.paymentInfo.rentPeriods
			: ([] as any);
		this.branch.paymentInfo.extendPeriods = this.branch.paymentInfo
			.extendPeriods
			? this.branch.paymentInfo.extendPeriods
			: ([] as any);
		this.branch.paymentInfo.responsibleForDelivery = this.branch.paymentInfo
			.responsibleForDelivery
			? this.branch.paymentInfo.responsibleForDelivery
			: false;
		this.branch.paymentInfo.payLater = this.branch.paymentInfo.payLater
			? this.branch.paymentInfo.payLater
			: false;
		if (!this.branch.deliveryMethods) {
			this.branch.deliveryMethods = {
				byMail: false,
				branch: false,
			};
		} else {
			this.branch.deliveryMethods.branch = this.branch.deliveryMethods
				.branch
				? this.branch.deliveryMethods.branch
				: false;
			this.branch.deliveryMethods.byMail = this.branch.deliveryMethods
				.byMail
				? this.branch.deliveryMethods.byMail
				: false;
		}

		if (!this.branch.paymentInfo.sell) {
			this.branch.paymentInfo.sell = {
				percentage: 0,
			};
		}
	}

	public onRentPeriodDelete(index: number) {
		this.branch.paymentInfo.rentPeriods.splice(index, 1);
		this.onUpdate();
	}

	public onPartlyPaymentPeriodDelete(index: number) {
		this.branch.paymentInfo.partlyPaymentPeriods.splice(index, 1);
		this.onUpdate();
	}

	public onPartlyPaymentPeriodAdd() {
		this.branch.paymentInfo.partlyPaymentPeriods.push({
			type: "semester",
			date: new Date(),
			percentageBuyout: 1,
			percentageBuyoutUsed: 1,
			percentageUpFront: 1,
			percentageUpFrontUsed: 1,
		});
		this.onUpdate();
	}

	public onRentPeriodAdd() {
		this.branch.paymentInfo.rentPeriods.push({
			type: "semester",
			date: new Date(),
			maxNumberOfPeriods: 1,
			percentage: 1,
		});
		this.onUpdate();
	}

	public onExtendPeriodDelete(index: number) {
		this.branch.paymentInfo.extendPeriods.splice(index, 1);
		this.onUpdate();
	}

	public onExtendPeriodAdd() {
		this.branch.paymentInfo.extendPeriods.push({
			type: "semester",
			maxNumberOfPeriods: 1,
			date: new Date(),
			price: 1,
		});
		this.onUpdate();
	}

	public onUpdate() {
		this._branchService
			.update(this.branch.id, this.branch)
			.then((updatedBranch: Branch) => {
				this.branch = updatedBranch;
			})
			.catch((updateBranchError) => {
				console.log(
					"branchEditPriceInfoComponent: could not update branch"
				);
			});
	}
}
