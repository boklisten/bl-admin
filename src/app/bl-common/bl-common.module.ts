import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlCommonUpdateButtonComponent} from './bl-common-update-button/bl-common-update-button.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCircleNotch, faCheckCircle, faExclamation} from '@fortawesome/free-solid-svg-icons';
import { BlCommonAlertComponent } from './bl-common-alert/bl-common-alert.component';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { BlSearchBarComponent } from './search/bl-search-bar/bl-search-bar.component';
import {FormsModule} from '@angular/forms';

library.add(faCircleNotch, faCheckCircle, faExclamation);

@NgModule({
	imports: [
		CommonModule,
		NgbAlertModule,
		FontAwesomeModule,
		FormsModule
	],
	declarations: [BlCommonUpdateButtonComponent, BlCommonAlertComponent, BlSearchBarComponent],
	exports: [
		BlCommonUpdateButtonComponent,
		BlCommonAlertComponent,
		BlSearchBarComponent
	]
})
export class BlCommonModule {
}
