import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-unique-item-search",
	templateUrl: "./unique-item-search.component.html",
	styleUrls: ["./unique-item-search.component.scss"],
})
export class UniqueItemSearchComponent implements OnInit {
	constructor(private _router: Router) {}

	public onBlidSearch(blid: string) {
		this._router.navigate(["/blid/" + blid]);
	}

	ngOnInit() {}
}
