import { Injectable } from "@angular/core";
import { TextBlock } from "@wizardcoder/bl-model";
import { MessageService } from "@wizardcoder/bl-connect";
import { Observable, Subject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class MessengerReminderService {
	private successfullMessage$: Subject<string>;
	private failedMessages$: Subject<string>;

	constructor(private messageService: MessageService) {
		this.successfullMessage$ = new Subject();
		this.failedMessages$ = new Subject();
	}

	public sendReminders(
		userIds: string[],
		deadline: Date,
		textBlocks: TextBlock[]
	) {

		for (let userId of userIds) {
			this.messageService
				.sendReminder(userId, deadline, textBlocks)
				.then((val) => {
					this.successfullMessage$.next(userId);
				})
				.catch((err) => {
					this.failedMessages$.next(userId);
        });
      /*
			this.simulatedSendReminder(userId)
				.then(() => {
					this.successfullMessage$.next(userId);
				})
				.catch(() => {
					this.failedMessages$.next(userId);
				});
       */
		}
	}

	public onSuccessfulMessage(): Observable<string> {
		return this.successfullMessage$.asObservable();
	}

	public onFailedMessage(): Observable<string> {
		return this.failedMessages$.asObservable();
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
