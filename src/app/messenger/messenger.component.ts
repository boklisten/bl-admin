import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-messenger",
	templateUrl: "./messenger.component.html",
	styleUrls: ["./messenger.component.scss"],
})
export class MessengerComponent implements OnInit {
	public active: string;
	ngOnInit() {
		this.active = "list";
	}
}
