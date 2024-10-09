import { Component, OnInit, Input } from "@angular/core";
import {
	BranchService,
	CustomerItemService,
	ItemService,
} from "@boklisten/bl-connect";
import { Branch, CustomerItem, Item } from "@boklisten/bl-model";
import moment from "moment-es6";
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

	public selectedBranch: string;
	public branches: Branch[];

	constructor(
		private _customerItemService: CustomerItemService,
		private _itemService: ItemService,
		private _toasterService: ToasterService,
		private _authService: AuthService,
		private _branchService: BranchService
	) {
		this.showMore = false;
	}

	ngOnInit() {
		this.isAdmin = this._authService.isAdmin();
		this.getAllBranches();

		if (this.customerItem) {
			this.selectedBranch = this.customerItem.handoutInfo.handoutById;
			this.getItem();
		}

		if (this.customerItemId) {
			console.log("customerItemId", this.customerItemId);
			this.getCustomerItem(this.customerItemId);
		}
	}

	private async getAllBranches() {
		this._branchService.get().then((branches: Branch[]) => {
			this.branches = branches.sort((a, b) =>
				a.name.localeCompare(b.name, "no")
			);
		});
	}

	public async updateCustomerItemBranch(newBranchId: string) {
		try {
			this.customerItem = await this._customerItemService.update(
				this.customerItem.id,
				{
					handoutInfo: {
						...this.customerItem?.handoutInfo,
						handoutById: newBranchId,
					},
				}
			);
			this._toasterService.add("SUCCESS", "Filial ble oppdatert!");
		} catch (e) {
			this._toasterService.add("WARNING", {
				text: "Oppdatering av filial feilet! Årsak: " + e?.msg,
			});
		} finally {
			this.selectedBranch = this.customerItem.handoutInfo.handoutById;
		}
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
