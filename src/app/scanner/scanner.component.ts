import { Component, OnInit } from "@angular/core";
import { Item } from "@wizardcoder/bl-model";
import { UniqueItemService } from "@wizardcoder/bl-connect";

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

	constructor(private uniqeItemService: UniqueItemService) {
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

		this.pushUniqueItemsToDB()
			.then(() => {
				this.wait = false;
				this.successStatus = {
					title: this.selectedItem.title,
					numberOfBlids: this.blids.length
				};
				this.selectedItem = null;
				this.blids = [];

				setTimeout(() => {
					this.successStatus = null;
					this.error = false;
				}, 3500);
			})
			.catch(() => {
				this.error = true;
				this.wait = false;
				setTimeout(() => {
					this.error = false;
				}, 3500);
			});
	}

	private async pushUniqueItemsToDB(): Promise<boolean> {
		for (let blid of this.blids) {
			try {
				await this.uniqeItemService.add({
					id: "",
					item: this.selectedItem.id,
					blid: blid,
					title: this.selectedItem.title
				});
			} catch (e) {
				throw e;
			}
		}

		return true;
	}
}
