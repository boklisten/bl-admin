import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {LoginModule} from '@wizardcoder/bl-login';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {environment} from '../environments/environment';
import {HeaderComponent} from './header/header.component';
import {SideBarComponent} from './side-bar/side-bar.component';
import { SideBarButtonComponent } from './side-bar/side-bar-button/side-bar-button.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faUser, faUsers, faMoneyBillAlt, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';

library.add(faUser, faUsers, faMoneyBillAlt, faUserCircle);

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
		FontAwesomeModule
	],
	providers: [
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor() {
		LoginModule.withConfig({successPath: 'home', apiPath: environment.apiPath});
	}
}
