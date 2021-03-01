import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { ItemService } from "@boklisten/bl-connect";
import { BlApiError, Item } from "@boklisten/bl-model";

@Component({
	selector: "app-item-detail",
	templateUrl: "./item-detail.component.html",
	styleUrls: ["./item-detail.component.scss"],
})
export class ItemDetailComponent implements OnInit {
	private _currentId: string;
	public item: Item;
	public notFoundText: string;
	public wait: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _itemService: ItemService
	) {}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this._currentId = params["id"];

			if (this._currentId) {
				this.getItem(this._currentId);
			}
		});
	}

	getItem(id: string) {
		this.wait = true;
		this._itemService
			.getById(id)
			.then((item: Item) => {
				this.item = item;
				this.wait = false;
			})
			.catch((blApiError: BlApiError) => {
				this.notFoundText = "could not find item";
				this.wait = false;
				console.log("itemDetailComponent: could not get error");
			});
	}
}
