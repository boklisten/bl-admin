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
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MessengerMatchService } from "./messenger-match.service";
import { CustomerItemHandlerService } from "../../customer-item/customer-item-handler/customer-item-handler.service";
import { MessengerSendModalComponent } from "../messenger-send-modal/messenger-send-modal.component";

@Component({
	selector: "app-messenger-match",
	templateUrl: "./messenger-match.component.html",
	styleUrls: ["./messenger-match.component.scss"]
})
export class MessengerMatchComponent implements OnInit {
	public deadline: Date;
	public textBlocks: TextBlock[];
	public loading: boolean;
	public selectedType: CustomerItemType | "all" | "match";
	public selectedBranches: string[];
	public noCustomerItemsFoundError: boolean;
	public sequenceNumber: number;
	public smsMedium: boolean;

	constructor(
		private messageService: MessageService,
		private customerItemService: CustomerItemService,
		private customerItemHandlerService: CustomerItemHandlerService,
		private branchStoreService: BranchStoreService,
		private messengerMatchService: MessengerMatchService,
		private modalService: NgbModal,
		private branchHelperService: BranchHelperService
	) {
		this.deadline = new Date(2019, 11, 20);
		this.textBlocks = [];
		this.loading = false;
		this.selectedBranches = [];
		this.sequenceNumber = 0;
		this.smsMedium = false;
		this.selectedType = "match";
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

		this.getUniqueCustomerWithNotReturnedCustomerItems("partly-payment")
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

	private openModal(customerIds: string[]) {
		const modalRef = this.modalService.open(MessengerSendModalComponent, {
			size: "lg"
		});

		modalRef.componentInstance.name = "MessageModal";
		modalRef.componentInstance.customerIds = customerIds;
		modalRef.componentInstance.settings = {
			messageType: "match",
			messageMethod: "sms",
			sequenceNumber: this.sequenceNumber,
			deadline: this.deadline
		};
	}
	private getUniqueCustomerWithNotReturnedCustomerItems(
		type: CustomerItemType | "all"
	): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.customerItemHandlerService
				.getNotReturnedCustomerItems(
					type as any,
					this.deadline,
					this.selectedBranches
				)
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
}
