import {
	Component,
	OnInit,
	Input,
	SimpleChanges,
	OnChanges
} from "@angular/core";
import { Item } from "@boklisten/bl-model";
import { ItemService } from "@boklisten/bl-connect";

@Component({
	selector: "app-item-information",
	templateUrl: "./item-information.component.html",
	styleUrls: ["./item-information.component.scss"]
})
export class ItemInformationComponent implements OnInit, OnChanges {
	@Input() item: Item;
	@Input() itemId: string;

	constructor(private _itemService: ItemService) {}

	ngOnChanges(changes: SimpleChanges) {
		this.getItem();
	}

	ngOnInit() {
		this.getItem();
	}

	private getItem() {
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
