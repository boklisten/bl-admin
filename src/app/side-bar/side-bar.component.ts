import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserDetail, UserPermission } from "@wizardcoder/bl-model";
import { Router, RouterEvent, ActivatedRoute } from "@angular/router";
import { CustomerService } from "../customer/customer.service";
import { UserService } from "../user/user.service";
import { CartService } from "../cart/cart.service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { BlcHotkeyService } from "../bl-common/blc-hotkey/blc-hotkey.service";

@Component({
	selector: "app-side-bar",
	templateUrl: "./side-bar.component.html",
	styleUrls: ["./side-bar.component.scss"]
})
export class SideBarComponent implements OnInit, OnDestroy {
	public customerDetail: UserDetail;
	public sidebarLinks: {
		name: string;
		link: string;
		notification?: boolean;
		icon: string;
		selected: boolean;
		permission: UserPermission;
		hide?: boolean;
		color?: string;
	}[];

	private customer$: Subscription;
	private customerClear$: Subscription;
	private router$: Subscription;
	private currentSidebarLinkIndex = 0;

	constructor(
		private _customerService: CustomerService,
		private _router: Router,
		private _userService: UserService,
		private _authService: AuthService,
		private _blcHotkeyService: BlcHotkeyService
	) {
		this.sidebarLinks = [
			{
				name: "customer",
				link: "",
				icon: "address-card",
				selected: false,
				permission: "employee",
				hide: true
			},
			{
				name: "cart",
				link: "cart",
				icon: "shopping-cart",
				permission: "employee",
				selected: false
			},
			{
				name: "booking",
				link: "booking",
				icon: "calendar-alt",
				permission: "employee",
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
			{
				name: "messenger",
				link: "messenger",
				icon: "envelope",
				permission: "admin",
				selected: false
			},
			{
				name: "database",
				link: "database",
				icon: "database",
				permission: "admin",
				selected: false
			},
			{
				name: "user",
				link: "user",
				icon: this.getUserIcon(),
				permission: "employee",
				selected: false,
				color: "info"
			}
		];
	}

	ngOnInit() {
		this.hideNoPermissionLinks();
		this.handleCustomerChange();
		this.handleCustomerClearChange();
		this.handleRouterChange();
		this.handleControlUpShortcut();
		this.handleControlDownShortcut();
	}

	ngOnDestroy() {
		this.customer$.unsubscribe();
		this.customerClear$.unsubscribe();
		this.router$.unsubscribe();
	}

	private handleControlUpShortcut() {
		this._blcHotkeyService
			.addShortcut({ keys: "control.arrowup" })
			.subscribe(() => {
				if (this.currentSidebarLinkIndex > 0) {
					this.currentSidebarLinkIndex--;
					this.selectSidebarLinkBasedOnIndex(
						this.currentSidebarLinkIndex
					);
				}
			});
	}
	private handleControlDownShortcut() {
		this._blcHotkeyService
			.addShortcut({ keys: "control.arrowdown" })
			.subscribe(() => {
				if (
					this.currentSidebarLinkIndex <
					this.sidebarLinks.length - 1
				) {
					this.currentSidebarLinkIndex++;
					this.selectSidebarLinkBasedOnIndex(
						this.currentSidebarLinkIndex
					);
				}
			});
	}

	private selectSidebarLinkBasedOnIndex(index: number) {
		if (this.sidebarLinks[index]) {
			this.deselectAllSideBarLinks();
			this.sidebarLinks[index].selected = true;
			this.currentSidebarLinkIndex = index;
			this._router.navigate([this.sidebarLinks[index].link]);
		}
	}

	private handleRouterChange() {
		this.router$ = this._router.events.subscribe((event: RouterEvent) => {
			if (event.url) {
				this.selectSidebarLinkBasedOnRoute(
					this.getFirstSegment(event.url)
				);
			}
		});
	}

	private getUserIcon(): string {
		let permission = this._authService.getPermission();
		switch (permission) {
			case "employee":
				return "user";
			case "manager":
				return "user-tie";
			case "admin":
				return "user-astronaut";
			case "super":
				return "user-secret";
		}
	}

	private getFirstSegment(url: string) {
		if (url) {
			let a = url.split("/");
			if (a[1]) {
				let b = a[1].split("?")[0];
				return b;
			}
			return "";
		}
	}

	private handleCustomerChange() {
		this.customer$ = this._customerService.subscribe(
			(customerDetail: UserDetail) => {
				for (const sidebarLink of this.sidebarLinks) {
					if (sidebarLink.name === "customer") {
						sidebarLink.link =
							"customer/" + customerDetail.id + "/detail";
						sidebarLink.hide = false;
						this.hideNoPermissionLinks();
						return;
					}
				}
			}
		);
	}

	private handleCustomerClearChange() {
		this.customerClear$ = this._customerService.onClear(() => {
			for (const sidebarLink of this.sidebarLinks) {
				if (sidebarLink.name === "customer") {
					sidebarLink.hide = true;
					this.hideNoPermissionLinks();
				}
			}
		});
	}

	private selectSidebarLinkBasedOnRoute(url: string) {
		for (let i = 0; i < this.sidebarLinks.length; i++) {
			if (url.indexOf(this.sidebarLinks[i].name) >= 0) {
				this.deselectAllSideBarLinks();
				this.sidebarLinks[i].selected = true;
				this.currentSidebarLinkIndex = i;
				return;
			}
		}
	}

	private setNotificationOnSidebarLink(name: string, notification: boolean) {
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
