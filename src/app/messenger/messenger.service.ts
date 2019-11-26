import { Injectable } from "@angular/core";
import { MessageService } from "@wizardcoder/bl-connect";
import { Message } from "@wizardcoder/bl-model";
import { Observable, Subject } from "rxjs";
import { MessageSettings } from "./message-settings";

@Injectable({
	providedIn: "root"
})
export class MessengerService {
	private successfullMessage$: Subject<string>;
	private failedMessages$: Subject<{ userId: string; error: any }>;

	constructor(private messageService: MessageService) {
		this.successfullMessage$ = new Subject();
		this.failedMessages$ = new Subject();
	}

	public send(customerIds: string[], settings: MessageSettings) {
		for (let customerId of customerIds) {
			this.messageService
				.add(this.createMessage(customerId, settings))
				.then(message => {
					this.successfullMessage$.next(message.customerId);
				})
				.catch(err => {
					this.failedMessages$.next({
						userId: customerId,
						error: err
					});
				});
		}
	}

	public onSuccessfulMessage(): Observable<string> {
		return this.successfullMessage$.asObservable();
	}

	public onFailedMessage(): Observable<{ userId: string; error: any }> {
		return this.failedMessages$.asObservable();
	}

	private createMessage(userId: string, settings: MessageSettings): Message {
		return {
			id: "",
			messageType: settings.messageType,
			messageSubtype: settings.messageSubtype
				? settings.messageSubtype
				: "none",
			messageMethod: settings.messageMethod
				? settings.messageMethod
				: "email",
			sequenceNumber: settings.sequenceNumber
				? settings.sequenceNumber
				: 0,
			subject: settings.subject ? settings.subject : null,
			htmlContent: settings.htmlContent ? settings.htmlContent : null,
			customerId: userId
		};
	}
}
