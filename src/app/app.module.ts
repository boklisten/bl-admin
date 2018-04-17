import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {LoginModule} from '@wizardcoder/bl-login';
import {AppRoutingModule} from './app-routing.module';
import { HomeComponent } from './home/home.component';
import {environment} from '../environments/environment';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    LoginModule.withConfig({successPath: 'home', apiPath: environment.apiPath});
  }
}
