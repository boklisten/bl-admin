import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MessengerSendModalComponent } from "../messenger-send-modal/messenger-send-modal.component";
import { UserDetailService } from "@wizardcoder/bl-connect";
import { MessengerGenericService } from "./messenger-generic.service";
import { MessageSettings } from "../message-settings";

@Component({
	selector: "app-messenger-generic",
	templateUrl: "./messenger-generic.component.html",
	styleUrls: ["./messenger-generic.component.scss"]
})
export class MessengerGenericComponent implements OnInit {
	public htmlText: string;
	public loading: boolean;
	public branchIds: string[];
	public noCustomersFoundError: boolean;
	public htmlTextEmptyError: boolean;
	public subjectEmptyError: boolean;
	public subject: string;

	constructor(
		private modalService: NgbModal,
		private messengerGenericService: MessengerGenericService
	) {
		this.htmlText = "";
		this.loading = false;
		this.branchIds = [];
		this.subject = "";
	}

	ngOnInit() {}

	public openSendGenericModal() {
		this.htmlTextEmptyError = false;
		this.noCustomersFoundError = false;
		this.subjectEmptyError = false;
		if (this.htmlText.length <= 0) {
			this.htmlTextEmptyError = true;
			return;
		}

		if (this.subject.length <= 0) {
			this.subjectEmptyError = true;
			return;
		}

		this.messengerGenericService
			.getCustomerIds(this.branchIds)
			.then((userDetailIds: string[]) => {
				this.openModal(userDetailIds);
			})
			.catch(e => {
				this.noCustomersFoundError = true;
				setTimeout(() => {
					this.noCustomersFoundError = false;
					this.htmlTextEmptyError = false;
				}, 2500);
			});
	}

	private openModal(customerIds: string[]) {
		const modalRef = this.modalService.open(MessengerSendModalComponent, {
			size: "lg"
		});

		modalRef.componentInstance.name = "MessageModal";
		modalRef.componentInstance.customerIds = customerIds;
		modalRef.componentInstance.settings = {
			messageType: "generic",
			sequenceNumber: 0,
			messageSubtype: "none",
			messageMethod: "email",
			subject: this.subject,
			htmlContent: this.htmlText
		};
	}

	public onSelectBranches(branchIds: string[]) {
		this.branchIds = branchIds;
	}
}
