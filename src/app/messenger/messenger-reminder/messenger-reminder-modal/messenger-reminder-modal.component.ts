import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MessengerReminderService } from "../messenger-reminder.service";
import { TextBlock, CustomerItemType } from "@wizardcoder/bl-model";

@Component({
	selector: "app-messenger-reminder-modal",
	templateUrl: "./messenger-reminder-modal.component.html",
	styleUrls: ["./messenger-reminder-modal.component.scss"]
})
export class MessengerReminderModalComponent implements OnInit {
	@Input() name: string;
	@Input() customerIds: string[];
	@Input() deadline: Date;
  @Input() type: CustomerItemType | 'all';
	@Input() textBlocks: TextBlock[];
	public confirmed: boolean;
	public progressbarValue: number;
	public successfullMessages: number;
	public failedMessages: string[];
	public remindersDone: boolean;
	private progressBarValuePart: number;
	private progressbarValueFull: number;
  public finished: boolean;

	constructor(
		public activeModal: NgbActiveModal,
		private messengerReminderService: MessengerReminderService
	) {
		this.confirmed = false;
		this.successfullMessages = 0;
		this.failedMessages = [];
		this.remindersDone = false;
    this.finished = false;
	}

	ngOnInit() {
		this.progressbarValue = 0;
		this.progressBarValuePart = 0;
		this.onSuccessfulMessage();
		this.onFailedMessage();
	}

	onConfirm() {
    this.confirmed = true;
		this.sendReminders(this.customerIds);
	}

	private createFakeCustomerIds(): string[] {
		let randomNumOfCustomers = Math.floor(Math.random() * 10000) + 500;
		let customerIds = [];
		for (let i = 0; i < randomNumOfCustomers; i++) {
			customerIds.push(i).toString();
		}
		return customerIds;
	}

	retryFailedMessages() {
		this.remindersDone = false;

		this.sendReminders(this.failedMessages);
	}

	sendReminders(customerIds: string[]) {
		this.successfullMessages = 0;
		this.failedMessages = [];

		this.progressbarValue = 0;
		this.progressBarValuePart = 1;
		this.progressbarValueFull = customerIds.length;

		this.messengerReminderService.sendReminders(
			customerIds,
      this.deadline,
      this.type,
			this.textBlocks
		);
	}

	onSuccessfulMessage() {
		this.messengerReminderService.onSuccessfulMessage().subscribe(() => {
			this.successfullMessages++;
			this.progressbarValue += this.progressBarValuePart;
			this.checkIfDone();
		});
	}

	onFailedMessage() {
		this.messengerReminderService.onFailedMessage().subscribe(userId => {
			this.failedMessages.push(userId);
			this.progressbarValue += this.progressBarValuePart;
			this.checkIfDone();
		});
  }

  onDone() {
    this.activeModal.close();
  }

	private checkIfDone() {
		if (this.progressbarValue >= this.progressbarValueFull) {
			setTimeout(() => {
				this.remindersDone = true;
        this.finished = true;
			}, 2000);
		}
	}
}
