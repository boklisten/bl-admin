import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AuthLoginService, LoginModule} from '@wizardcoder/bl-login';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {environment} from '../environments/environment';
import {HeaderComponent} from './header/header.component';
import {SideBarComponent} from './side-bar/side-bar.component';
import { SideBarButtonComponent } from './side-bar/side-bar-button/side-bar-button.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {BranchStoreService} from './branch/branch-store.service';
import {BranchModule} from './branch/branch.module';
import {BranchGuardService} from './branch/branch-guard.service';
import {StorageService} from './storage/storage.service';
import {CustomerModule} from './customer/customer.module';

import {faUser, faUsers, faMoneyBillAlt, faUserCircle, faCheck, faLocationArrow, faSearch, faAt, faPhone,
	faAddressCard, faQrcode, faSyncAlt, faTimes, faShoppingCart, faClock, faWarehouse, faDollarSign,
	faCreditCard, faBook, faTruck, faArrowRight, faCalendarAlt, faTags, faExchangeAlt, faBarcode,
	faCalendar, faCartPlus, faCheckCircle, faClipboardList, faBan, faCalendarPlus} from '@fortawesome/free-solid-svg-icons';
import {BlCommonModule} from './bl-common/bl-common.module';
import {ItemModule} from './item/item.module';
import {BlConnectModule} from "@wizardcoder/bl-connect";
import {CartModule} from "./cart/cart.module";
import {CartService} from './cart/cart.service';
import {DateService} from './date/date.service';
import {CustomerOrderService} from './order/customer-order/customer-order.service';
import {CustomerService} from './customer/customer.service';
library.add(faUser, faUsers, faMoneyBillAlt, faUserCircle, faCheck, faLocationArrow, faSearch, faAt,
	faPhone, faAddressCard, faQrcode, faSyncAlt, faTimes, faShoppingCart, faClock, faWarehouse, faDollarSign, faCreditCard,
	faBook, faTruck, faArrowRight, faCalendarAlt, faTags, faExchangeAlt, faBarcode, faCalendar, faCartPlus, faCheckCircle, faClipboardList,
	faBan, faCalendarPlus);

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		HeaderComponent,
		SideBarComponent,
		SideBarButtonComponent
	],
	imports: [
		BrowserModule,
		BlConnectModule,
		AppRoutingModule,
		AuthModule,
		LoginModule,
		UserModule,
		BranchModule,
		FontAwesomeModule,
		CustomerModule,
		BlCommonModule,
		ItemModule,
		CartModule
	],
	providers: [
		AuthLoginService,
		BranchStoreService,
		BranchGuardService,
		StorageService,
		CartService,
		DateService,
		CustomerOrderService,
		CustomerService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor() {
		BlConnectModule.withConfig({basePath: environment.apiPath});
		LoginModule.withConfig({
			successPath: 'home',
			apiPath: environment.apiPath,
			userAgreementUrl: '/',
			logoutPath: '/auth/menu',
			permissionDeniedPath: '/auth/permission/denied',
			permissions: ['employee', 'admin']
		});
	}
}
