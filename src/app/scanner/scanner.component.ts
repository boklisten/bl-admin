import { Component, OnInit } from "@angular/core";
import { Item } from "@wizardcoder/bl-model";

@Component({
	selector: "app-scanner",
	templateUrl: "./scanner.component.html",
	styleUrls: ["./scanner.component.scss"]
})
export class ScannerComponent implements OnInit {
	public blids: string[];
	public selectedItem: Item;
	public wait: boolean;
	public successStatus: { numberOfBlids: number; title: string };
	public error: boolean;

	constructor() {
		this.blids = [];
	}

	ngOnInit() {}

	public onItemSelect(item: Item) {
		this.selectedItem = item;
	}

	public onBlidListChange(blids: string[]) {
		this.blids = blids;
	}

	public onInsertToDB() {
		this.wait = true;

		console.log(
			`should add ${this.blids.length} BLIDs as "${
				this.selectedItem.title
			}"`
		);

		setTimeout(() => {
			/*
			this.successStatus = {
				title: this.selectedItem.title,
				numberOfBlids: this.blids.length
			};
      */
			this.error = true;

			this.wait = false;
			this.selectedItem = null;
			this.blids = [];

			setTimeout(() => {
				this.successStatus = null;
				this.error = false;
			}, 3500);
		}, 1500);
	}
}
