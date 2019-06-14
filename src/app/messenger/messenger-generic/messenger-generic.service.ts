import { Injectable } from "@angular/core";
import { UserDetailService, MessageService } from "@wizardcoder/bl-connect";
import { UserDetail, Message } from "@wizardcoder/bl-model";
import { Observable, Subject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class MessengerGenericService {
	private successfullMessage$: Subject<string>;
	private failedMessages$: Subject<{ userId: string; error: any }>;

	constructor(
		private userDetailService: UserDetailService,
		private messageService: MessageService
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

	public async getCustomerIds(branchIds: string[]): Promise<string[]> {
		let query = `?${this.getBranchIdQuery(branchIds)}`;
		const userDetails = await this.userDetailService.get({ query: query });
		return this.filterUserDetailIds(userDetails);
	}

	public onSuccessfulMessage(): Observable<string> {
		return this.successfullMessage$.asObservable();
	}

	public onFailedMessage(): Observable<{ userId: string; error: any }> {
		return this.failedMessages$.asObservable();
	}

	private filterUserDetailIds(userDetails: UserDetail[]): string[] {
		let userDetailIds = [];
		for (let userDetail of userDetails) {
			userDetailIds.push(userDetail.id);
		}
		return userDetailIds;
	}

	private getBranchIdQuery(branchIds: string[]) {
		let query = "";
		for (let branchId of branchIds) {
			query += `branch=${branchId}&`;
		}
		return query;
	}
}
