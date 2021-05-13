import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ScannedBook } from "@boklisten/bl-model/dist/bulk-collection/bulk-collection";

@Component({
	selector: "app-user-order-summary",
	templateUrl: "./user-order-summary.component.html",
	styleUrls: ["./user-order-summary.component.scss"],
})
export class UserOrderSummaryComponent implements OnInit {
	@Input() userBooks: ScannedBook[];
	@Input() isHistory: boolean;
	@Input() remainingBooks: ScannedBook[] = [];
	@Output() fetchData = new EventEmitter<string>();
	public isCollapsed: boolean;
	public waiting = false;

	constructor(private _router: Router) {}

	ngOnInit(): void {
		this.isCollapsed = this.isLoading() || !this.isHistory;
		this.waiting = this.isLoading();
	}

	private isLoading(): boolean {
		return !this.userBooks || this.userBooks[0].item === "" ? true : false;
	}

	onCollapseChange() {
		if (this.userBooks[0].item === "" && this.isCollapsed === true) {
			this.fetchData.emit(this.userBooks[0].customerId);
		}
		this.isCollapsed = !this.isCollapsed;
	}

	public onCustomerOrderIdClick(id: string) {
		this._router.navigate(["order/" + id + "/detail"]);
	}
}
