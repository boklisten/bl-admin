import { Component, OnInit, Input } from "@angular/core";
import { Item } from "@wizardcoder/bl-model";
import { ItemService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-item-information",
	templateUrl: "./item-information.component.html",
	styleUrls: ["./item-information.component.scss"]
})
export class ItemInformationComponent implements OnInit {
	@Input() item: Item;
	@Input() itemId: string;

	constructor(private _itemService: ItemService) {}

	ngOnInit() {
		if (this.itemId) {
			this._itemService
				.getById(this.itemId)
				.then(item => {
					this.item = item;
				})
				.catch(e => {
					console.log("could not get item", e);
				});
		}
	}
}
