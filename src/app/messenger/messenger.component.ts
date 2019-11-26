import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbTabChangeEvent } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-messenger",
	templateUrl: "./messenger.component.html",
	styleUrls: ["./messenger.component.scss"]
})
export class MessengerComponent implements OnInit {
	public activeTab: string;
	constructor(private route: ActivatedRoute, private router: Router) {}

	ngOnInit() {
		this.activeTab = this.route.snapshot.firstChild
			? this.route.snapshot.firstChild.url[0].path
			: null;
	}

	public onTabChange(tabChangeEvent: NgbTabChangeEvent) {
		this.router.navigate(["messenger/" + tabChangeEvent.nextId]);
	}
}
