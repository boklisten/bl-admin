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
	faCalendar, faCartPlus, faCheckCircle, faClipboardList, faBan, faCalendarPlus, faArrowDown, faArrowUp,
	faArrowAltCircleDown, faDatabase, faSquare, faCheckSquare, faEllipsisV, faFilter, faInfoCircle,
	faEraser, faArchive, faToggleOn, faToggleOff, faEdit, faPlus, faReceipt} from '@fortawesome/free-solid-svg-icons';
import {BlCommonModule} from './bl-common/bl-common.module';
import {ItemModule} from './item/item.module';
import {BlConnectConfigService, BlConnectModule} from '@wizardcoder/bl-connect';
import {CartModule} from "./cart/cart.module";
import {CartService} from './cart/cart.service';
import {DateService} from './date/date.service';
import {CustomerOrderService} from './order/customer-order/customer-order.service';
import {CustomerService} from './customer/customer.service';
import {SearchModule} from './search/search.module';
import {UserService} from './user/user.service';
import {DatabaseModule} from './database/database.module';
import {BranchItemStoreService} from './branch/branch-item-store/branch-item-store.service';
import {PriceModule} from './price/price.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
library.add(faUser, faUsers, faMoneyBillAlt, faUserCircle, faCheck, faLocationArrow, faSearch, faAt,
	faPhone, faAddressCard, faQrcode, faSyncAlt, faTimes, faShoppingCart, faClock, faWarehouse, faDollarSign, faCreditCard,
	faBook, faTruck, faArrowRight, faCalendarAlt, faTags, faExchangeAlt, faBarcode, faCalendar, faCartPlus, faCheckCircle, faClipboardList,
	faBan, faCalendarPlus, faArrowDown, faArrowUp, faArrowAltCircleDown, faDatabase, faSquare, faCheckSquare, faEllipsisV,
	faFilter, faInfoCircle, faEraser, faArchive, faToggleOn, faToggleOff, faEdit, faPlus, faReceipt
);

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
		CartModule,
		SearchModule,
		DatabaseModule,
		PriceModule,
		NgbDropdownModule
	],
	providers: [
		AuthLoginService,
		BranchStoreService,
		BranchItemStoreService,
		BranchGuardService,
		StorageService,
		CartService,
		DateService,
		CustomerOrderService,
		CustomerService,
		UserService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private _blConnectConfig: BlConnectConfigService) {
		LoginModule.withConfig({
			successPath: 'home',
			registerSuccessPath: '/auth/login',
			apiPath: environment.apiPath,
			userAgreementUrl: '/',
			logoutPath: '/auth/menu',
			permissionDeniedPath: '/auth/permission/denied',
			permissions: ['employee', 'manager', 'admin', 'super']
		});

		_blConnectConfig.setConfig({basePath: environment.apiPath});
	}
}
