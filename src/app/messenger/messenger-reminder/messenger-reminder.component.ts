import { Component, OnInit } from "@angular/core";
import {
	TextBlock,
	Message,
	CustomerItem,
	CustomerItemType,
	BlApiNotFoundError
} from "@boklisten/bl-model";
import { MessageService, CustomerItemService } from "@boklisten/bl-connect";
import { BranchStoreService } from "../../branch/branch-store.service";
import { BranchHelperService } from "../../branch/branch-helper/branch-helper.service";
import { MessengerReminderService } from "./messenger-reminder.service";
import { MessengerReminderModalComponent } from "./messenger-reminder-modal/messenger-reminder-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import moment from "moment-es6";

@Component({
	selector: "app-messenger-reminder",
	templateUrl: "./messenger-reminder.component.html",
	styleUrls: ["./messenger-reminder.component.scss"]
})
export class MessengerReminderComponent implements OnInit {
	public deadline: Date;
	public textBlocks: TextBlock[];
	public loading: boolean;
	public selectedType: CustomerItemType | "all";
	public selectedBranches: string[];
	public noCustomerItemsFoundError: boolean;
	public sequenceNumber: number;
	public smsMedium: boolean;
	public emailMedium: boolean;
	public mediums: { sms: boolean; email: boolean; voice: boolean };

	constructor(
		private messageService: MessageService,
		private customerItemService: CustomerItemService,
		private branchStoreService: BranchStoreService,
		private messengerReminderService: MessengerReminderService,
		private modalService: NgbModal,
		private branchHelperService: BranchHelperService
	) {
		this.deadline = new Date(2019, 11, 20);
		this.textBlocks = [];
		this.loading = false;
		this.selectedBranches = [];
		this.sequenceNumber = 0;
		this.mediums = { sms: false, email: true, voice: false };
	}

	ngOnInit() {}

	public onSelectBranches(selectedBranches: string[]) {
		this.selectedBranches = selectedBranches;
	}

	public onSelectType(selectedType: CustomerItemType | "all") {
		this.selectedType = selectedType;
	}

	public onSequencePicked(pickedSequence: number) {
		this.sequenceNumber = pickedSequence;
	}

	public openSendRemindersModal() {
		this.loading = true;
		this.noCustomerItemsFoundError = false;

		this.getUniqueCustomerWithNotReturnedCustomerItems(this.selectedType)
			.then((uniqueCustomerIds: string[]) => {
				this.loading = false;
				this.openModal(uniqueCustomerIds);
			})
			.catch(err => {
				if (
					err instanceof BlApiNotFoundError ||
					(err.name && err.name === "BlApiNotFoundError")
				) {
					this.noCustomerItemsFoundError = true;
				}
				console.log(
					"messengerReminder: could not get unique customer ids",
					err
				);
				this.loading = false;
			});
	}

	public openModal(customerIds: string[]) {
		const modalRef = this.modalService.open(
			MessengerReminderModalComponent,
			{
				size: "lg"
			}
		);

		modalRef.componentInstance.name = "RemindersModal";
		modalRef.componentInstance.customerIds = customerIds;
		modalRef.componentInstance.deadline = this.deadline;
		modalRef.componentInstance.textBlocks = this.textBlocks;
		modalRef.componentInstance.sequenceNumber = this.sequenceNumber;
		modalRef.componentInstance.type = this.selectedType;
		modalRef.componentInstance.mediums = this.mediums;
	}

	private getUniqueCustomerWithNotReturnedCustomerItems(
		type: CustomerItemType | "all"
	): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.getNotReturnedCustomerItems(type)
				.then((customerItems: CustomerItem[]) => {
					resolve(this.getUniqueUserIds(customerItems));
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	private getUniqueUserIds(customerItems: CustomerItem[]): string[] {
		const uniqueCustomerIds = [];

		for (const customerItem of customerItems) {
			if (uniqueCustomerIds.indexOf(customerItem.customer) < 0) {
				uniqueCustomerIds.push(customerItem.customer);
			}
		}
		return uniqueCustomerIds;
	}

	private async getNotReturnedCustomerItems(
		type: CustomerItemType | "all"
	): Promise<CustomerItem[]> {
		const deadlineAboveString = moment(this.deadline)
			.subtract("day", 1)
			.format("DDMMYYYYHHmm");
		const deadlineBelowString = moment(this.deadline)
			.add("day", 1)
			.format("DDMMYYYYHHmm");

		let query = `?returned=false&buyout=false&match=false&deadline=>${deadlineAboveString}&deadline=<${deadlineBelowString}`;

		// we currently have no notion of "loan" and therefore need to create this 'hack'
		const loanBranches = await this.getLoanBranches();
		if (type === "loan") {
			let filteredBranches = [];
			if (this.selectedBranches.length > 0) {
				for (const branchId of this.selectedBranches) {
					if (loanBranches.indexOf(branchId) >= 0) {
						filteredBranches.push(branchId);
					}
				}
			} else {
				filteredBranches = loanBranches;
			}
			if (filteredBranches.length <= 0) {
				throw new Error(
					`none of the branches have 'loan' as a possebility`
				);
			}
			query += this.getBranchQuery(filteredBranches);
		} else {
			let filteredBranches = [];
			const noLoanBranches = await this.branchHelperService.getNoneLoanBranches();

			if (this.selectedBranches.length > 0) {
				for (const branchId of this.selectedBranches) {
					if (noLoanBranches.indexOf(branchId) >= 0) {
						filteredBranches.push(branchId);
					}
				}
			} else {
				filteredBranches = noLoanBranches;
			}
			query += this.getBranchQuery(filteredBranches);
		}

		const queryType = type !== "partly-payment" ? "rent" : "partly-payment";

		query += `&type=${queryType}`;

		return this.customerItemService.get({ query: query, fresh: true });
	}

	private getBranchQuery(branchIds: string[]) {
		let query = "";
		for (const branchId of branchIds) {
			query += `&handoutInfo.handoutById=${branchId}`;
		}
		return query;
	}

	private async getNoLoanBranches() {
		const branches = await this.branchStoreService.getAllBranches();

		const noLoanBranches = [];

		for (const branch of branches) {
			if (!branch.paymentInfo.responsible) {
				noLoanBranches.push(branch.id);
			}
		}

		return noLoanBranches;
	}

	private async getLoanBranches() {
		const branches = await this.branchStoreService.getAllBranches();

		const loanBranches = [];

		for (const branch of branches) {
			if (branch.paymentInfo.responsible) {
				loanBranches.push(branch.id);
			}
		}

		return loanBranches;
	}
}
