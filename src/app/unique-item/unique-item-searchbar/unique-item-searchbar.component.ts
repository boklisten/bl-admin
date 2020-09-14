import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-unique-item-searchbar",
	templateUrl: "./unique-item-searchbar.component.html",
	styleUrls: ["./unique-item-searchbar.component.scss"]
})
export class UniqueItemSearchbarComponent implements OnInit {
	@Input() blid: string;

	constructor(private _router: Router) {}

	ngOnInit() {
		if (!this.blid) {
			this.blid = "";
		}
	}

	public onBlidSearch() {
		this._router.navigate(["/blid/" + this.blid]);
	}
}
