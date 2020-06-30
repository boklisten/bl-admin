import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { UniqueItem, Item } from "@wizardcoder/bl-model";
import { UniqueItemStoreService } from "../unique-item-store.service";

@Component({
	selector: "app-unique-item-register",
	templateUrl: "./unique-item-register.component.html",
	styleUrls: ["./unique-item-register.component.scss"]
})
export class UniqueItemRegisterComponent implements OnInit {
	@Input() blid: string;
	@Input() item: Item;
	@Output() registered: EventEmitter<UniqueItem>;
	public wait: boolean;
	public error: boolean;

	constructor(private _uniqueItemStoreService: UniqueItemStoreService) {
		this.registered = new EventEmitter();
	}

	ngOnInit() {}

	public onInsertToDB() {
		this.wait = true;
		this.error = false;

		this._uniqueItemStoreService
			.createAndAdd(this.blid, this.item)
			.then(addedUniqueItem => {
				this.wait = false;
				this.item = null;
				this.blid = null;
				this.registered.emit(addedUniqueItem);
			})
			.catch(() => {
				this.wait = false;
				this.error = true;
			});
	}

	public onItemSelect(item: Item) {
		this.item = item;
	}
}
