import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { UniqueItem } from "@wizardcoder/bl-model";
import { UniqueItemStoreService } from "../unique-item-store.service";

@Component({
	selector: "app-unique-item-detail",
	templateUrl: "./unique-item-detail.component.html",
	styleUrls: ["./unique-item-detail.component.scss"]
})
export class UniqueItemDetailComponent implements OnInit {
	public currentBlid: string;
	public uniqueItem: UniqueItem;

	constructor(
		private _route: ActivatedRoute,
		private _uniqeItemStoreService: UniqueItemStoreService
	) {}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this.currentBlid = params["blid"];

			if (this.currentBlid) {
				this.getUniqueItem(this.currentBlid);
			}
		});
	}

	private getUniqueItem(blid: string) {
		this._uniqeItemStoreService
			.get(blid)
			.then(uniqueItem => {
				this.uniqueItem = uniqueItem;
			})
			.catch(err => {
				console.log("could not find uniqueItem", err);
			});
	}
}
