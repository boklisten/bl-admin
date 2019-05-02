import { Component, OnInit } from "@angular/core";
import { TextBlock, Message, CustomerItem, CustomerItemType, BlApiNotFoundError } from "@wizardcoder/bl-model";
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
  public selectedType: CustomerItemType | 'all';
  public selectedBranches: string[];
  public noCustomerItemsFoundError: boolean;

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
	}

	ngOnInit() {}

	public onSelectBranches(selectedBranches: string[]) {
    this.selectedBranches = selectedBranches;
  }

  public onSelectType(selectedType: CustomerItemType | 'all') {
    this.selectedType = selectedType;
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
        if (err instanceof BlApiNotFoundError || err.name && err.name === 'BlApiNotFoundError') {
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
    modalRef.componentInstance.type = this.selectedType;
	}

	private getUniqueCustomerWithNotReturnedCustomerItems(type: CustomerItemType | 'all'): Promise<string[]> {
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
		return uniqueCustomerIds;
	}

	private getNotReturnedCustomerItems(type: CustomerItemType | 'all'): Promise<CustomerItem[]> {

		let deadlineString = moment(this.deadline).format("DDMMYYYYHHmm");
		let query = `?returned=false&deadline=${deadlineString}`;

    if (this.selectedBranches.length <= 0) {
		  let branch = this.branchStoreService.getCurrentBranch();
      this.selectedBranches.push(branch.id);
    }

    for (let branchId of this.selectedBranches) {
      query += `&handoutInfo.handoutById=${branchId}`;
    }

    if (type && type !== 'all') {
      query += `&type=${type}`
    }

		return new Promise((resolve, reject) => {
			this.customerItemService
				.get(query)
				.then((customerItems: CustomerItem[]) => {
					resolve(customerItems);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}
