import {
	Component,
	OnInit,
	Input,
	SimpleChanges,
	OnChanges,
} from "@angular/core";
import { UniqueItem, CustomerItem } from "@boklisten/bl-model";
import { UniqueItemService, CustomerItemService } from "@boklisten/bl-connect";

@Component({
	selector: "app-unique-item-active-information",
	templateUrl: "./unique-item-active-information.component.html",
	styleUrls: ["./unique-item-active-information.component.scss"],
})
export class UniqueItemActiveInformationComponent implements OnInit, OnChanges {
	@Input() uniqueItem: UniqueItem;
	public activeCustomerItem: CustomerItem;
	public wait: boolean;

	constructor(
		private _uniqueItemService: UniqueItemService,
		private _customerItemService: CustomerItemService
	) {}

	ngOnChanges(changes: SimpleChanges) {
		this.getActiveCustomerItem();
	}

	ngOnInit() {
		this.getActiveCustomerItem();
	}

	public getActiveCustomerItem() {
		this.wait = true;
		this._uniqueItemService
			.getWithOperation(this.uniqueItem.id, "active")
			.then((activeCustomerItem) => {
				if (typeof activeCustomerItem == "string") {
					this.getCustomerItem(activeCustomerItem);
				}
				this.wait = false;
			})
			.catch((e) => {
				this.activeCustomerItem = null;
				this.wait = false;
				console.log("could not get active ");
			});
	}

	public getCustomerItem(customerItemId: string) {
		this._customerItemService
			.getById(customerItemId)
			.then((customerItem) => {
				this.activeCustomerItem = customerItem;
			})
			.catch((e) => {});
	}
}
