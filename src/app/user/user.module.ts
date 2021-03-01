import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { UserComponent } from "./user.component";
import {
	FontAwesomeModule,
	FaIconLibrary,
} from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { UserInfoSmallComponent } from "./user-info-small/user-info-small.component";

@NgModule({
	imports: [CommonModule, UserRoutingModule, FontAwesomeModule],
	declarations: [UserComponent, UserInfoSmallComponent],
	exports: [UserInfoSmallComponent],
})
export class UserModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faSignOutAlt);
	}
}
