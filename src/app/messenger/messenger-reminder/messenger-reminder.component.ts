import { Component, OnInit } from "@angular/core";
import { TextBlock, Message, CustomerItem } from "@wizardcoder/bl-model";
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

	constructor(
		private messageService: MessageService,
		private customerItemService: CustomerItemService,
		private branchStoreService: BranchStoreService,
		private messengerReminderService: MessengerReminderService,
		private modalService: NgbModal
	) {
		this.deadline = new Date();
		this.textBlocks = [];
		this.loading = false;
	}

	ngOnInit() {}

	public onSelectBranches(selectedBranches: string[]) {
		console.log("selected branches", selectedBranches);
	}

	public openSendRemindersModal(content) {
		this.loading = true;

		this.getUniqueCustomerWithNotReturnedCustomerItems()
			.then((uniqueCustomerIds: string[]) => {
				this.loading = false;
				this.openModal(uniqueCustomerIds);
			})
			.catch(err => {
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
				size: "lg",
			}
		);

		modalRef.componentInstance.name = "RemindersModal";
		modalRef.componentInstance.customerIds = customerIds;
		modalRef.componentInstance.deadline = this.deadline;
		modalRef.componentInstance.textBlocks = this.textBlocks;
	}

	private getUniqueCustomerWithNotReturnedCustomerItems(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.getNotReturnedCustomerItems()
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

	private getNotReturnedCustomerItems(): Promise<CustomerItem[]> {
		let branch = this.branchStoreService.getCurrentBranch();
		let deadlineString = moment(this.deadline).format("DDMMYYYYHHmm");
		let query = `?returned=false&deadline=${deadlineString}&branch=${
			branch.id
		}`;

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
