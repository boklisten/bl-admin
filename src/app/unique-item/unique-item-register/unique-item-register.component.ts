import {
	Component,
	OnInit,
	Input,
	EventEmitter,
	Output,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { UniqueItem, Item } from "@boklisten/bl-model";
import { UniqueItemStoreService } from "../unique-item-store.service";

@Component({
	selector: "app-unique-item-register",
	templateUrl: "./unique-item-register.component.html",
	styleUrls: ["./unique-item-register.component.scss"],
})
export class UniqueItemRegisterComponent implements OnInit {
	@Input() blid: string;
	@Input() itemId: string;
	@Input() title: string;
	@Input() isbn: number;
	@Output() registered: EventEmitter<UniqueItem>;
	@Output() skip: EventEmitter<boolean>;
	public wait: boolean;
	public blidAlreadyAddedError: boolean;
	public item: Item;
	public uniqueItem: UniqueItem;
	public editBlid: boolean;
	public editItem: boolean;
	public uniqueItemRegisterError: boolean;
	public blidIsPartOfISBN: boolean;

	constructor(private _uniqueItemStoreService: UniqueItemStoreService) {
		this.registered = new EventEmitter();
		this.skip = new EventEmitter();
	}

	ngOnInit() {
		if (this.blid) {
			this.editBlid = false;
			this.editItem = true;
		}

		if (this.itemId) {
			this.editItem = false;
			this.editBlid = true;
		}
	}

	public onBlid(blid: string) {
		this.blid = blid;
		this.blidAlreadyAddedError = false;
		this.blidIsPartOfISBN = String(this.isbn).includes(blid);

		this._uniqueItemStoreService
			.get(this.blid)
			.then((uniqueItem) => {
				if (uniqueItem.item === this.itemId) {
					this.registered.emit(uniqueItem);
				} else {
					this.blidAlreadyAddedError = true;
					this.uniqueItem = uniqueItem;
				}
			})
			.catch((e) => {
				this.blidAlreadyAddedError = false;
				this.uniqueItem = null;
			});
	}

	public onInsertToDB() {
		this.wait = true;
		this.blidAlreadyAddedError = false;
		this.uniqueItemRegisterError = false;

		this._uniqueItemStoreService
			.createAndAdd(this.blid, this.itemId, this.title)
			.then((addedUniqueItem) => {
				this.wait = false;
				this.onClearItem();
				this.onClearBlid();
				this.registered.emit(addedUniqueItem);
			})
			.catch(() => {
				this.wait = false;
				this.uniqueItemRegisterError = true;
			});
	}

	public onClearItem() {
		this.item = null;
		this.itemId = "";
		this.title = "";
		this.isbn = null;
	}

	public onClearBlid() {
		this.blid = null;
	}

	public onSkip() {
		this.skip.emit(true);
	}

	public onItemSelect(item: Item) {
		this.blidAlreadyAddedError = false;
		this.item = item;
		this.itemId = item.id;
		this.title = item.title;
		this.isbn = item.info.isbn;
	}
}
