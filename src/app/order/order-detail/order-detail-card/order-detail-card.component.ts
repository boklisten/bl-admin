import { Component, Input, OnInit } from "@angular/core";
import { Branch, Order } from "@boklisten/bl-model";
import {
	BranchService,
	CustomerItemService,
	OrderService,
} from "@boklisten/bl-connect";
import { ToasterService } from "../../../toaster/toaster.service";
import { AuthService } from "../../../auth/auth.service";

@Component({
	selector: "app-order-detail-card",
	templateUrl: "./order-detail-card.component.html",
	styleUrls: ["./order-detail-card.component.scss"],
})
export class OrderDetailCardComponent implements OnInit {
	@Input() order: Order;

	public selectedBranch: string;
	public branches: Branch[];
	public isAdmin: boolean;

	constructor(
		private _branchService: BranchService,
		private _orderService: OrderService,
		private _toasterService: ToasterService,
		private _authService: AuthService,
		private _customerItemService: CustomerItemService
	) {}

	ngOnInit() {
		this.isAdmin = this._authService.isAdmin();
		this.getAllBranches();
		this.selectedBranch = String(this.order.branch);
	}

	private async getAllBranches() {
		this._branchService.get().then((branches: Branch[]) => {
			this.branches = branches;
		});
	}

	public async updateOrderBranch(newBranchId: string) {
		try {
			this.order = await this._orderService.update(this.order.id, {
				branch: newBranchId,
			});
			const customerItems = await this._customerItemService.getManyByIds(
				this.order.orderItems.map((orderItem) =>
					String(orderItem.customerItem)
				)
			);
			await Promise.all(
				customerItems.map((customerItem) =>
					this._customerItemService.update(customerItem.id, {
						handoutInfo: {
							...customerItem?.handoutInfo,
							handoutById: newBranchId,
						},
					})
				)
			);
			this._toasterService.add("SUCCESS", "Filial ble oppdatert!");
		} catch (e) {
			this._toasterService.add("WARNING", {
				text: "Oppdatering av filial feilet! Årsak: " + e?.msg,
			});
		} finally {
			this.selectedBranch = String(this.order.branch);
		}
	}
}
