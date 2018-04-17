import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import { UserComponent } from './user.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

library.add(faSignOutAlt);

@NgModule({
	imports: [
		CommonModule,
		UserRoutingModule,
		FontAwesomeModule
	],
	declarations: [UserComponent]
})
export class UserModule {
}
