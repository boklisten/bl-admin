import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
	selector: "app-unique-item-detail",
	templateUrl: "./unique-item-detail.component.html",
	styleUrls: ["./unique-item-detail.component.scss"]
})
export class UniqueItemDetailComponent implements OnInit {
	public currentBlid: string;

	constructor(private _route: ActivatedRoute) {}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this.currentBlid = params["blid"];

			if (this.currentBlid) {
			}
		});
	}
}
