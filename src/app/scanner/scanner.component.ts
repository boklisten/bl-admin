import { Component, OnInit } from "@angular/core";
import { Item } from "@wizardcoder/bl-model";

@Component({
	selector: "app-scanner",
	templateUrl: "./scanner.component.html",
	styleUrls: ["./scanner.component.scss"]
})
export class ScannerComponent implements OnInit {
	constructor() {}

	ngOnInit() {}

	onItemSelect(item: Item) {
		console.log("selected Item", item ? item.title : "<no item>");
	}
}
