import { Component, OnInit } from "@angular/core";
import { UserDetail, UserPermission } from "@wizardcoder/bl-model";
import { Router, RouterEvent } from "@angular/router";
import { CustomerService } from "../customer/customer.service";
import { Customer } from "../customer/customer";
import { s } from "@angular/core/src/render3";
import { UserService } from "../user/user.service";
import { CartService } from "../cart/cart.service";

@Component({
	selector: "app-side-bar",
	templateUrl: "./side-bar.component.html",
	styleUrls: ["./side-bar.component.scss"]
})
export class SideBarComponent implements OnInit {
	public customerDetail: UserDetail;
	public sidebarLinks: {
		name: string;
		link: string;
		notification?: boolean;
		icon: string;
		selected: boolean;
		permission: UserPermission;
		hide?: boolean;
	}[];

	constructor(
		private _customerService: CustomerService,
		private _router: Router,
		private _cartService: CartService,
		private _userService: UserService
	) {
		this.sidebarLinks = [
			{
				name: "search",
				link: "search",
				icon: "search",
				permission: "customer",
				selected: false
			},
			{
				name: "customer",
				link: "",
				icon: "address-card",
				selected: false,
				permission: "customer",
				hide: true
			},
			{
				name: "cart",
				link: "cart",
				icon: "shopping-cart",
				permission: "customer",
				selected: false
			},
			{
				name: "orders",
				link: "orders",
				icon: "receipt",
				permission: "manager",
				selected: false
			},
			{
				name: "invoices",
				link: "invoices",
				icon: "file-invoice-dollar",
				permission: "admin",
				selected: false
			},
			/*{*/
			//name: "messenger",
			//link: "messenger",
			//icon: "envelope",
			//permission: "admin",
			//selected: false
			/*}*/ {
				name: "database",
				link: "database",
				icon: "database",
				permission: "admin",
				selected: false
			}
		];
	}

	ngOnInit() {
		this._router.events.subscribe((event: RouterEvent) => {
			if (event.url) {
				this.selectSidebarLinkBasedOnRoute(event.url);
			}
		});

		this.hideNoPermissionLinks();

		this._cartService.onCartChange().subscribe(() => {
			if (this._cartService.getCart().length > 0) {
				this.setNotificationOnSidebarLink("cart", true);
			} else {
				this.setNotificationOnSidebarLink("cart", false);
			}
		});

		this._customerService.onCustomerChange().subscribe(() => {
			if (this._customerService.haveCustomer()) {
				for (const sidebarLink of this.sidebarLinks) {
					if (sidebarLink.name === "customer") {
						sidebarLink.link =
							"customer/" +
							this._customerService.get().detail.id +
							"/detail";
						sidebarLink.hide = false;
						this.hideNoPermissionLinks();
						return;
					}
				}
			} else {
				for (const sidebarLink of this.sidebarLinks) {
					if (sidebarLink.name === "customer") {
						sidebarLink.hide = true;
						this.hideNoPermissionLinks();
					}
				}
			}
		});
	}

	selectSidebarLinkBasedOnRoute(url: string) {
		for (const sidebarLink of this.sidebarLinks) {
			if (url.indexOf(sidebarLink.name) >= 0) {
				this.deselectAllSideBarLinks();

				sidebarLink.selected = true;
				return;
			}
		}
	}

	setNotificationOnSidebarLink(name: string, notification: boolean) {
		for (const sidebarLink of this.sidebarLinks) {
			if (sidebarLink.name === name) {
				sidebarLink.notification = notification;
				return;
			}
		}
	}

	private hideNoPermissionLinks() {
		for (const sidebarLink of this.sidebarLinks) {
			if (!this._userService.havePermission(sidebarLink.permission)) {
				sidebarLink.hide = true;
			}
		}
	}

	private deselectAllSideBarLinks() {
		for (const sidebarLink of this.sidebarLinks) {
			sidebarLink.selected = false;
		}
	}
}
