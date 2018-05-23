import {Component, OnInit} from '@angular/core';
import {UserDetail} from '@wizardcoder/bl-model';
import {Router, RouterEvent} from '@angular/router';
import {CustomerService} from '../customer/customer.service';
import {Customer} from '../customer/customer';
import {s} from '@angular/core/src/render3';

@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
	public customerDetail: UserDetail;
	public sidebarLinks: { name: string, link: string, icon: string, selected: boolean, hide?: boolean}[];

	constructor(private _customerService: CustomerService, private _router: Router) {
		this.sidebarLinks = [
			{
				name: 'search',
				link: 'search',
				icon: 'search',
				selected: false
			},
			{
				name: 'cart',
				link: 'cart',
				icon: 'shopping-cart',
				selected: false
			},
			{
				name: 'customer',
				link: '',
				icon: 'user',
				selected: false,
				hide: true
			},
			{
				name: 'database',
				link: 'database',
				icon: 'database',
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

		this._customerService.onCustomerChange().subscribe(() => {
			if (this._customerService.haveCustomer()) {
				for (const sidebarLink of this.sidebarLinks) {
					if (sidebarLink.name === 'customer') {
						sidebarLink.link = 'customer/' + this._customerService.get().detail.id + '/detail';
						sidebarLink.hide = false;
						return;
					}
				}
			} else {
				for (const sidebarLink of this.sidebarLinks) {
					if (sidebarLink.name === 'customer') {
						sidebarLink.hide = true;
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

	private deselectAllSideBarLinks() {
		for (const sidebarLink of this.sidebarLinks) {
			sidebarLink.selected = false;
		}
	}
}
