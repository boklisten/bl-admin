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
	faAddressCard, faQrcode, faSyncAlt, faTimes, faShoppingCart, faClock, faWarehouse, faDollarSign, faCreditCard} from '@fortawesome/free-solid-svg-icons';
import {BlCommonModule} from './bl-common/bl-common.module';
library.add(faUser, faUsers, faMoneyBillAlt, faUserCircle, faCheck, faLocationArrow, faSearch, faAt,
	faPhone, faAddressCard, faQrcode, faSyncAlt, faTimes, faShoppingCart, faClock, faWarehouse, faDollarSign, faCreditCard);

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
		AppRoutingModule,
		AuthModule,
		LoginModule,
		UserModule,
		BranchModule,
		FontAwesomeModule,
		CustomerModule,
		BlCommonModule
	],
	providers: [
		AuthLoginService,
		BranchStoreService,
		BranchGuardService,
		StorageService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor() {
		LoginModule.withConfig({
			successPath: 'home',
			apiPath: environment.apiPath,
			userAgreementUrl: '/',
			logoutPath: '/',
			permissionDeniedPath: '/auth/permission/denied',
			permissions: ['employee', 'admin']
		});
	}
}
