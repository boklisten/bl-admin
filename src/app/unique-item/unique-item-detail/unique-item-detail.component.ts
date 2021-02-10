import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UniqueItem } from "@boklisten/bl-model";
import { UniqueItemStoreService } from "../unique-item-store.service";

@Component({
	selector: "app-unique-item-detail",
	templateUrl: "./unique-item-detail.component.html",
	styleUrls: ["./unique-item-detail.component.scss"]
})
export class UniqueItemDetailComponent implements OnInit {
	public currentBlid: string;
	public uniqueItem: UniqueItem;
	public wait: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _uniqeItemStoreService: UniqueItemStoreService
	) {}

	ngOnInit() {
		this.uniqueItem = null;
		this._route.params.subscribe((params: Params) => {
			console.log("changed!", params["blid"]);
			this.currentBlid = params["blid"];

			if (this.currentBlid) {
				this.getUniqueItem(this.currentBlid);
			}
		});
	}

	public onBlidChange(blid: string) {
		this.currentBlid = blid;
		//this._router.navigate(["/blid/" + blid]);
		//this.getUniqueItem(this.currentBlid);
	}

	private getUniqueItem(blid: string) {
		this.wait = true;
		this._uniqeItemStoreService
			.get(blid)
			.then(uniqueItem => {
				this.uniqueItem = uniqueItem;
				this.wait = false;
			})
			.catch(err => {
				console.log("could not find uniqueItem", err);
				this.uniqueItem = null;
				this.wait = false;
			});
	}
}
