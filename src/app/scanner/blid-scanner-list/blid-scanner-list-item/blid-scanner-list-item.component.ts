import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UniqueItemStoreService } from "../../../unique-item/unique-item-store.service";
import { UniqueItem } from "@boklisten/bl-model";

@Component({
	selector: "app-blid-scanner-list-item",
	templateUrl: "./blid-scanner-list-item.component.html",
	styleUrls: ["./blid-scanner-list-item.component.scss"],
})
export class BlidScannerListItemComponent implements OnInit {
	@Input() blid: string;
	@Output() remove: EventEmitter<boolean>;
	@Output() valid: EventEmitter<boolean>;
	@Output() alreadyAdded: EventEmitter<boolean>;

	public wait: boolean;
	public uniqueItem: UniqueItem;

	constructor(private _uniqueItemStoreService: UniqueItemStoreService) {
		this.remove = new EventEmitter();
		this.valid = new EventEmitter();
		this.alreadyAdded = new EventEmitter();
	}

	ngOnInit() {
		this.wait = true;
		this._uniqueItemStoreService
			.get(this.blid)
			.then((uniqueItem) => {
				this.wait = false;
				this.uniqueItem = uniqueItem;
				this.alreadyAdded.emit(true);
			})
			.catch((e) => {
				this.wait = false;
			});
	}

	public onRemove() {
		this.remove.emit(true);
	}
}
