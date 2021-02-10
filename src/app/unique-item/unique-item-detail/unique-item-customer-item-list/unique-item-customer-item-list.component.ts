import {
	Component,
	OnInit,
	Input,
	SimpleChanges,
	OnChanges
} from "@angular/core";
import { CustomerItem } from "@boklisten/bl-model";
import { CustomerItemService } from "@boklisten/bl-connect";

@Component({
	selector: "app-unique-item-customer-item-list",
	templateUrl: "./unique-item-customer-item-list.component.html",
	styleUrls: ["./unique-item-customer-item-list.component.scss"]
})
export class UniqueItemCustomerItemListComponent implements OnInit {
	@Input() blid: string;
	public customerItems: CustomerItem[];
	public wait: boolean;

	constructor(private _customerItemService: CustomerItemService) {}

	ngOnChanges() {
		if (this.blid) {
			this.getCustomerItems(this.blid);
		} else {
			this.customerItems = [];
		}
	}

	ngOnInit() {
		this.getCustomerItems(this.blid);
	}

	private getCustomerItems(blid: string) {
		this.wait = true;
		this._customerItemService
			.get({ query: "?blid=" + blid })
			.then(customerItems => {
				this.customerItems = customerItems;
				this.wait = false;
			})
			.catch(e => {
				this.customerItems = [];
				this.wait = false;
			});
	}
}
