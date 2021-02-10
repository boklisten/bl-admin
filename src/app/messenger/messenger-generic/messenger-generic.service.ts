import { Injectable } from "@angular/core";
import { MessageService } from "@boklisten/bl-connect";
import { Message } from "@boklisten/bl-model";
import { Observable, Subject } from "rxjs";
import { BranchCustomerService } from "../../branch/branch-customer/branch-customer.service";

@Injectable({
	providedIn: "root"
})
export class MessengerGenericService {
	private successfullMessage$: Subject<string>;
	private failedMessages$: Subject<{ userId: string; error: any }>;

	constructor(
		private messageService: MessageService,
		private branchCustomerService: BranchCustomerService
	) {
		this.successfullMessage$ = new Subject();
		this.failedMessages$ = new Subject();
	}

	public sendMessages(
		userDetailIds: string[],
		subject: string,
		htmlContent: string
	) {
		for (let userDetailId of userDetailIds) {
			this.messageService
				.add(this.createMessage(userDetailId, subject, htmlContent))
				.then(() => {
					this.successfullMessage$.next(userDetailId);
				})
				.catch(err => {
					this.failedMessages$.next({
						userId: userDetailId,
						error: err
					});
				});
		}
	}

	private createMessage(
		userId: string,
		subject: string,
		htmlContent: string
	): Message {
		return {
			id: "",
			messageType: "generic",
			messageSubtype: "none",
			messageMethod: "email",
			sequenceNumber: 0,
			customerId: userId,
			htmlContent: htmlContent,
			subject: subject
		};
	}

	public async getCustomerIds(
		branchIds: string[],
		allCustomers?: boolean
	): Promise<string[]> {
		let userIds = [];
		for (let branchId of branchIds) {
			let branchUserIds = [];

			try {
				if (allCustomers) {
					branchUserIds = await this.branchCustomerService.getAllCustomers(
						branchId
					);
				} else {
					branchUserIds = await this.branchCustomerService.getAllActiveCustomers(
						branchId
					);
				}
			} catch (e) {
				branchUserIds = [];
			}

			userIds = userIds.concat(branchUserIds);
		}
		return userIds;
	}

	public onSuccessfulMessage(): Observable<string> {
		return this.successfullMessage$.asObservable();
	}

	public onFailedMessage(): Observable<{ userId: string; error: any }> {
		return this.failedMessages$.asObservable();
	}
}
