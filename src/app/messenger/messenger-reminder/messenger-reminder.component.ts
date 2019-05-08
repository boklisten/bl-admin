import { Component, OnInit } from "@angular/core";
import {
	TextBlock,
	Message,
	CustomerItem,
	CustomerItemType,
	BlApiNotFoundError
} from "@wizardcoder/bl-model";
import { MessageService, CustomerItemService } from "@wizardcoder/bl-connect";
import { BranchStoreService } from "../../branch/branch-store.service";
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

	constructor(
		private messageService: MessageService,
		private customerItemService: CustomerItemService,
		private branchStoreService: BranchStoreService,
		private messengerReminderService: MessengerReminderService,
		private modalService: NgbModal
	) {
		this.deadline = new Date(2019, 11, 20);
		this.textBlocks = [];
		this.loading = false;
		this.selectedBranches = [];
		this.sequenceNumber = 0;
		this.smsMedium = false;
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
		modalRef.componentInstance.smsMedium = this.smsMedium;
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
		let uniqueCustomerIds = [];

		for (let customerItem of customerItems) {
			if (uniqueCustomerIds.indexOf(customerItem.customer) < 0) {
				uniqueCustomerIds.push(customerItem.customer);
			}
    }
    console.log('unique', uniqueCustomerIds);
		return uniqueCustomerIds;
	}

	private async getNotReturnedCustomerItems(
		type: CustomerItemType | "all"
	): Promise<CustomerItem[]> {

		let deadlineAboveString = moment(this.deadline).subtract('day', 1).format("DDMMYYYYHHmm");
		let deadlineBelowString = moment(this.deadline).add('day', 1).format("DDMMYYYYHHmm");
    let query = `?returned=false&deadline=>${deadlineAboveString}&deadline=<${deadlineBelowString}`;

    // we currently have no notion of "loan" and therefore need to create this 'hack'
    let loanBranches = await this.getLoanBranches();
    if (type === 'loan') {
      let filteredBranches = [];
      if (this.selectedBranches.length > 0) {
        for (let branchId of this.selectedBranches) {
          if (loanBranches.indexOf(branchId) >= 0) {
            filteredBranches.push(branchId);
          }
        }
      } else {
        filteredBranches = loanBranches;
      }
      if (filteredBranches.length <= 0) {
        throw `none of the branches have 'loan' as a possebility`;
      }
      query += this.getBranchQuery(filteredBranches);
    } else {
      let filteredBranches = [];
      let noLoanBranches = await this.getNoLoanBranches();

      if (this.selectedBranches.length > 0) {
        for (let branchId of this.selectedBranches) {
          if (noLoanBranches.indexOf(branchId) >= 0) {
            filteredBranches.push(branchId);
          }
        }
      } else {
        filteredBranches = noLoanBranches;
      }
      query += this.getBranchQuery(filteredBranches);
    }

		if (type === "rent") {
			query += `&type=rent`;
    } else if (type === 'loan') {
      query += `&type=rent`;
    }

	  return this.customerItemService.get(query)
  }

  private getBranchQuery(branchIds: string[]) {
    let query = '';
    for (let branchId of branchIds) {
      query += `&handoutInfo.handoutById=${branchId}`;
    }
    return query;
  }

  private async getNoLoanBranches() {
    let branches = await this.branchStoreService.getAllBranches();

    let noLoanBranches = [];

    for (let branch of branches) {
      if (!branch.paymentInfo.responsible) {
        noLoanBranches.push(branch.id);
      }
    }

    return noLoanBranches;
  }

  private async getLoanBranches() {
    let branches = await this.branchStoreService.getAllBranches();

    let loanBranches = [];

    for (let branch of branches) {
      if (branch.paymentInfo.responsible) {
        loanBranches.push(branch.id);
      }
    }

    return loanBranches;
  }
}


