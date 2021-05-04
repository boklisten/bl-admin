import { Component, OnInit, Input } from "@angular/core";
import { MessageService } from "@boklisten/bl-connect";
import { Message } from "@boklisten/bl-model";
import { Observable, Subscription } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { ActivatedRoute, Params } from "@angular/router";

type SmsStatusType =
	| "accepted"
	| "queued"
	| "sending"
	| "sent"
	| "failed"
	| "delivered"
	| "undelivered"
	| "receiving"
	| "received";

@Component({
	selector: "app-messenger-list",
	templateUrl: "./messenger-list.component.html",
	styleUrls: ["./messenger-list.component.scss"],
})
export class MessengerListComponent implements OnInit {
	public messages: Message[];
	messages$: Observable<Message[]>;
	public selectedList: any;
	public selectedMessage: Message;
	public selectAll: boolean;
	public sortByEmailStatusDirection: "asc" | "desc" | "none";
	idParam$: Subscription;
	@Input() customerId: string;

	public filter: FormControl;

	constructor(
		private messageService: MessageService,
		private _route: ActivatedRoute
	) {
		this.filter = new FormControl("");
		this.selectedList = {};
	}

	ngOnDestroy(): void {
		this.idParam$.unsubscribe();
	}

	ngOnInit() {
		this.messages = [];

		this.messages$ = this.filter.valueChanges.pipe(
			startWith(""),
			map((text) => this.search(text))
		);

		let query = this.customerId ? `?customerId=${this.customerId}` : null;

		this.messageService
			.get({ query: query, fresh: true })
			.then((messages) => {
				console.log(messages);
				this.messages = messages;

				this.messages$ = this.filter.valueChanges.pipe(
					startWith(""),
					map((text) => this.search(text))
				);
			})
			.catch((err) => {
				console.log(err);
			});
		this.onIdParamChange();
	}

	private onIdParamChange() {
		this.idParam$ = this._route.params.subscribe((params: Params) => {
			this.customerId = params["id"];
		});
	}

	public search(text: string): Message[] {
		return this.messages.filter((message) => {
			const term = text.toLowerCase();
			return (
				message.id.toLowerCase().includes(term) ||
				message.messageType.toString().includes(term) ||
				(message.messageSubtype &&
					message.messageSubtype.toString().includes(term))
			);
		});
	}

	public sortEmailStatus() {
		if (this.sortByEmailStatusDirection === "none") {
			this.sortByEmailStatusDirection = "asc";
			this.messages$ = this.filter.valueChanges.pipe(
				startWith(""),
				map((text) => {
					this.messages
						.sort
						//(a, b) => parseInt(b.invoiceId) - parseInt(a.invoiceId)
						();
					return this.search(text);
				})
			);
		} else if (this.sortByEmailStatusDirection === "asc") {
			this.sortByEmailStatusDirection = "desc";
			this.messages$ = this.filter.valueChanges.pipe(
				startWith(""),
				map((text) => {
					this.messages
						.sort
						//(a, b) => parseInt(a.invoiceId) - parseInt(b.invoiceId)
						();
					return this.search(text);
				})
			);
		} else {
			this.sortByEmailStatusDirection = "none";
			this.messages$ = this.filter.valueChanges.pipe(
				startWith(""),
				map((text) => this.search(text))
			);
		}
	}

	public getRecipientEmail(message: Message) {
		for (let event of message.events) {
			if (event["email"]) {
				return event["email"];
			}
		}
		return message.customerId;
	}

	public getEmailStatus(
		message: Message
	): "delivered" | "bounce" | "open" | "span" | "report" | "unsubscribe" {
		let emailStatus = "";
		type emailStatusType =
			| "processed"
			| "dropped"
			| "deferred"
			| "bounce"
			| "delivered"
			| "open"
			| "click"
			| "unsubscribe";

		for (let event of message.events) {
			let eventStatus = event["event"] as emailStatusType;

			if (eventStatus === "open") {
				return eventStatus;
			} else if (eventStatus === "delivered") {
				emailStatus = eventStatus;
			} else if (
				eventStatus === "bounce" &&
				emailStatus !== "delivered"
			) {
				emailStatus = eventStatus;
			} else if (
				eventStatus === "dropped" &&
				emailStatus !== "delivered" &&
				emailStatus !== "bounce"
			) {
				emailStatus = eventStatus;
			} else if (
				eventStatus === "deferred" &&
				emailStatus !== "delivered" &&
				emailStatus !== "bounce" &&
				emailStatus !== "dropped"
			) {
				emailStatus = eventStatus;
			} else if (
				eventStatus !== "deferred" &&
				emailStatus !== "delivered" &&
				emailStatus !== "bounce" &&
				emailStatus !== "dropped"
			) {
				emailStatus = eventStatus;
			}
		}
		return emailStatus as any;
	}

	public getSmsStatus(message: Message): SmsStatusType {
		let smsStatus = "";

		for (let event of message.smsEvents) {
			let eventStatus = event["status"] as SmsStatusType;

			if (eventStatus === "delivered") {
				return eventStatus;
			} else if (eventStatus === "failed") {
				smsStatus = eventStatus;
			} else if (smsStatus !== "failed") {
				smsStatus = eventStatus;
			}
		}
		return smsStatus as SmsStatusType;
	}

	public onSelect(id: string) {
		this.selectedList[id] = !this.selectedList[id];
	}

	public onSelectAll() {
		this.selectAll = !this.selectAll;

		for (const message of this.search(this.filter.value)) {
			this.selectedList[message.id] = this.selectAll;
		}
	}

	public onSelectMessage(message: Message) {
		this.selectedMessage = message;
	}
}
