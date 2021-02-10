import { Component, OnInit } from "@angular/core";
import { Item } from "@boklisten/bl-model";
import { UniqueItemService } from "@boklisten/bl-connect";

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
	public clearBlids: boolean;

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
		this.clearBlids = false;
		this.wait = true;

		this.pushUniqueItemsToDB()
			.then(() => {
				this.wait = false;
				this.successStatus = {
					title: this.selectedItem.title,
					numberOfBlids: this.blids.length
				};
				this.selectedItem = null;
				this.blids = [];
				this.clearBlids = true;

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
