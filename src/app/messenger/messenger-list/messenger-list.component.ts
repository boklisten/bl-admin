import { Component, OnInit } from '@angular/core';
import { MessageService } from '@wizardcoder/bl-connect';
import { Message } from '@wizardcoder/bl-model';
import {Observable} from 'rxjs';
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: 'app-messenger-list',
  templateUrl: './messenger-list.component.html',
  styleUrls: ['./messenger-list.component.scss']
})
export class MessengerListComponent implements OnInit {
  public messages: Message[];
  messages$: Observable<Message[]>;
	public selectedList: any;
  public selectedMessage: Message;
  public selectAll: boolean;

	public filter: FormControl;

  constructor(private messageService: MessageService) {
		this.filter = new FormControl("");
		this.selectedList = {};
  }

  ngOnInit() {
    this.messages = [];

    this.messages$ = this.filter.valueChanges.pipe(
      startWith(""),
      map(text => this.search(text))
    );

    this.messageService.get().then((messages) => {
      console.log(messages);
      this.messages = messages;

      this.messages$ = this.filter.valueChanges.pipe(
        startWith(""),
        map(text => this.search(text))
      );
    }).catch((err) => {
      console.log(err);
    });
  }

	public search(text: string): Message[] {
		return this.messages.filter(message => {
			const term = text.toLowerCase();
			return (
				message.id.toLowerCase().includes(term) ||
				message.messageType.toString().includes(term) ||
        message.messageSubtype.toString().includes(term)
			);
		});
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
