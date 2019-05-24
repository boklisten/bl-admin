import { Injectable } from "@angular/core";
import { TextBlock, CustomerItemType, Message } from "@wizardcoder/bl-model";
import { MessageService } from "@wizardcoder/bl-connect";
import { Observable, Subject } from "rxjs";
import { DateService } from "../../date/date.service";

@Injectable({
	providedIn: "root"
})
export class MessengerReminderService {
	private successfullMessage$: Subject<string>;
	private failedMessages$: Subject<{ userId: string; error: any }>;

	constructor(
		private messageService: MessageService,
		private dateService: DateService
	) {
		this.successfullMessage$ = new Subject();
		this.failedMessages$ = new Subject();
	}

	public sendReminders(
		userIds: string[],
		deadline: Date,
		type: CustomerItemType | "all",
		sequenceNumber: number,
		mediums: { email: boolean; sms: boolean; voice: boolean },
		textBlocks: TextBlock[]
	) {
		for (let userId of userIds) {
			this.messageService
				.add(
					this.createMessage(
						userId,
						deadline,
						type,
						sequenceNumber,
						this.getMessageMethod(mediums),
						textBlocks
					)
				)
				.then(val => {
					this.successfullMessage$.next(userId);
				})
				.catch(err => {
					this.failedMessages$.next({ userId: userId, error: err });
				});
		}
	}

	private getMessageMethod(mediums: {
		email: boolean;
		sms: boolean;
		voice: boolean;
	}): "email" | "sms" | "all" {
		if (mediums.sms) {
			return "all";
		} else {
			return "email";
		}
	}

	public onSuccessfulMessage(): Observable<string> {
		return this.successfullMessage$.asObservable();
	}

	public onFailedMessage(): Observable<string> {
		return this.failedMessages$.asObservable();
	}

	private createMessage(
		userId: string,
		deadline: Date,
		type: CustomerItemType | "all",
		sequenceNumber: number,
		messageMethod: "email" | "sms" | "all",
		textBlocks: TextBlock[]
	): Message {
		return {
			id: "",
			messageType: "reminder",
			messageSubtype: type as any,
			messageMethod: messageMethod,
			sequenceNumber: sequenceNumber,
			customerId: userId,
			info: {
				deadline: this.dateService.toDeadlineFormat(deadline) as any
			},
			textBlocks: textBlocks && textBlocks.length > 0 ? textBlocks : []
		};
	}

	private simulatedSendReminder(userId: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			let randomWaitTime = Math.floor(Math.random() * 800) + 300;
			let randomFail = Math.floor(Math.random() * 100) + 1;

			setTimeout(() => {
				if (randomFail > 98) {
					reject(new Error("could not send"));
				} else {
					resolve(true);
				}
			}, randomWaitTime);
		});
	}
}
