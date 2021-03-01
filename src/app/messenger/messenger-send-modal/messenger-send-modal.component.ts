import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MessengerService } from "../messenger.service";
import { MessageSettings } from "../message-settings";

@Component({
	selector: "app-messenger-send-modal",
	templateUrl: "./messenger-send-modal.component.html",
	styleUrls: ["./messenger-send-modal.component.scss"],
})
export class MessengerSendModalComponent implements OnInit {
	@Input() customerIds: string[];
	@Input() settings: MessageSettings;

	public confirmed: boolean;
	public progressbarValue: number;
	public successfullMessages: number;
	public failedMessages: { userId: string; error: any }[];
	public messagesDone: boolean;
	private progressBarValuePart: number;
	private progressbarValueFull: number;
	public finished: boolean;

	constructor(
		public activeModal: NgbActiveModal,
		private messengerService: MessengerService
	) {
		this.confirmed = false;
		this.successfullMessages = 0;
		this.failedMessages = [];
		this.messagesDone = false;
		this.finished = false;
		this.progressbarValue = 0;
		this.progressBarValuePart = 0;
	}

	ngOnInit() {
		this.onSuccessfulMessage();
		this.onFailedMessage();
	}

	public onConfirm() {
		this.confirmed = true;
		this.sendMessages(this.customerIds);
	}

	public onDone() {
		this.activeModal.close();
	}

	private checkIfDone() {
		if (this.progressbarValue >= this.progressbarValueFull) {
			this.messagesDone = true;
			this.finished = true;
		}
	}

	sendMessages(customerIds: string[]) {
		this.successfullMessages = 0;
		this.failedMessages = [];

		this.progressbarValue = 0;
		this.progressBarValuePart = 1;
		this.progressbarValueFull = customerIds.length;

		this.messengerService.send(customerIds, this.settings);
	}

	private onSuccessfulMessage() {
		this.messengerService.onSuccessfulMessage().subscribe(() => {
			this.successfullMessages++;
			this.progressbarValue += this.progressBarValuePart;
			this.checkIfDone();
		});
	}

	private onFailedMessage() {
		this.messengerService.onFailedMessage().subscribe((failedMessage) => {
			this.failedMessages.push(failedMessage);
			this.progressbarValue += this.progressBarValuePart;
			this.checkIfDone();
		});
	}
}
