import {Component, OnInit} from '@angular/core';
import {UserDetail, UserPermission} from '@wizardcoder/bl-model';
import {Router, RouterEvent} from '@angular/router';
import {CustomerService} from '../customer/customer.service';
import {Customer} from '../customer/customer';
import {s} from '@angular/core/src/render3';
import {UserService} from '../user/user.service';

@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
	public customerDetail: UserDetail;
	public sidebarLinks: { name: string, link: string, icon: string, selected: boolean, permission: UserPermission, hide?: boolean }[];

	constructor(private _customerService: CustomerService, private _router: Router, private _userService: UserService) {
		this.sidebarLinks = [
			{
				name: 'search',
				link: 'search',
				icon: 'search',
				permission: 'customer',
				selected: false
			},
			{
				name: 'cart',
				link: 'cart',
				icon: 'shopping-cart',
				permission: 'customer',
				selected: false
			},
			{
				name: 'customer',
				link: '',
				icon: 'user',
				selected: false,
				permission: 'customer',
				hide: true
			},
			{
				name: 'orders',
				link: 'orders',
				icon: 'receipt',
				permission: 'manager',
				selected: false
			},
			{
				name: 'database',
				link: 'database',
				icon: 'database',
				permission: 'admin',
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


		this._customerService.onCustomerChange().subscribe(() => {
			if (this._customerService.haveCustomer()) {
				for (const sidebarLink of this.sidebarLinks) {
					if (sidebarLink.name === 'customer') {
						sidebarLink.link = 'customer/' + this._customerService.get().detail.id + '/detail';
						sidebarLink.hide = false;
						this.hideNoPermissionLinks();
						return;
					}
				}
			} else {
				for (const sidebarLink of this.sidebarLinks) {
					if (sidebarLink.name === 'customer') {
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
