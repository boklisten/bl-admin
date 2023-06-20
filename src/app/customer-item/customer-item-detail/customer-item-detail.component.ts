import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { CustomerItemService, ItemService } from "@boklisten/bl-connect";
import { CustomerItem, Item } from "@boklisten/bl-model";
import moment from "moment-es6";
import { Moment } from "moment";
import { ToasterService } from "../../toaster/toaster.service";
import { AuthService } from "../../auth/auth.service";

@Component({
	selector: "app-customer-item-detail",
	templateUrl: "./customer-item-detail.component.html",
	styleUrls: ["./customer-item-detail.component.scss"],
})
export class CustomerItemDetailComponent implements OnInit {
	@Input() customerItem: CustomerItem;
	@Input() customerItemId: string;
	public item: Item;
	public showMore: boolean;
	public deadlineInput: string;
	public isAdmin: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _customerItemService: CustomerItemService,
		private _itemService: ItemService,
		private _toasterService: ToasterService,
		private _authService: AuthService
	) {
		this.showMore = false;
	}

	ngOnInit() {
		this.isAdmin = this._authService.isAdmin();
		if (this.customerItem) {
			this.getItem();
		}

		if (this.customerItemId) {
			console.log("customerItemId", this.customerItemId);
			this.getCustomerItem(this.customerItemId);
		}

		/*
		this._route.params.subscribe((params: Params) => {
			if (params["id"]) {
				this.getCustomerItem(params["id"]);
			}
		});
       */
	}

	public onShowMore() {
		this.showMore = !this.showMore;
	}

	private getCustomerItem(id: string) {
		this._customerItemService
			.getById(id)
			.then((customerItem: CustomerItem) => {
				this.customerItem = customerItem;
				this.getItem();
			})
			.catch((getCustomerItemError) => {
				console.log(
					"customerItemDetailComponent: could not get customerItem",
					getCustomerItemError
				);
			});
	}

	private toPrettyDate(date: Date): string {
		return moment(date).format("DD.MM.YYYY");
	}

	private getItem() {
		this._itemService
			.getById(this.customerItem.item as string)
			.then((item: Item) => {
				this.item = item;
				this.deadlineInput = this.toPrettyDate(
					this.customerItem.deadline
				);
			})
			.catch((getItemError) => {
				console.log("customerItemDetailComponet: could not get item");
			});
	}

	public hasChangedDate(): boolean {
		return (
			this.toPrettyDate(this.customerItem.deadline) !== this.deadlineInput
		);
	}

	public async handleUpdateDeadline() {
		try {
			this.customerItem = await this._customerItemService.update(
				this.customerItem.id,
				{
					deadline: moment(this.deadlineInput, "DD.MM.YYYY"),
				}
			);
			this._toasterService.add("SUCCESS", "Fristen ble oppdatert!");
		} catch (e) {
			this._toasterService.add("WARNING", {
				text: "Oppdatering av fristen feilet. Årsak: " + e?.msg,
			});
		} finally {
			this.deadlineInput = this.toPrettyDate(this.customerItem.deadline);
		}
	}
}
