import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlCommonUpdateButtonComponent} from './bl-common-update-button/bl-common-update-button.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCircleNotch, faCheckCircle, faExclamation} from '@fortawesome/free-solid-svg-icons';
import { BlCommonAlertComponent } from './bl-common-alert/bl-common-alert.component';
import {NgbAlertModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { BlSearchBarComponent } from './search/bl-search-bar/bl-search-bar.component';
import {FormsModule} from '@angular/forms';
import {CustomerNamePipe} from "./pipes/customer/customer-name.pipe";
import {BranchNamePipe} from "./pipes/branch/branch-name.pipe";
import { BlDatePipe } from './pipes/date/bl-date.pipe';
import {BlcItemAddComponent} from './blc-item-add/blc-item-add.component';
import { BlcPricePipe } from './pipes/price/blc-price.pipe';
import { BlCommonToggleButtonComponent } from './bl-common-button/bl-common-toggle-button/bl-common-toggle-button.component';

library.add(faCircleNotch, faCheckCircle, faExclamation);

@NgModule({
	imports: [
		CommonModule,
		NgbAlertModule,
		FontAwesomeModule,
		FormsModule,
		NgbTooltipModule
	],
	declarations: [
		BlCommonUpdateButtonComponent,
		BlCommonAlertComponent,
		BlSearchBarComponent,
		CustomerNamePipe,
		BranchNamePipe,
		BlDatePipe,
		BlcItemAddComponent,
		BlcPricePipe,
		BlCommonToggleButtonComponent
	],
	exports: [
		BlCommonUpdateButtonComponent,
		BlCommonAlertComponent,
		BlSearchBarComponent,
		CustomerNamePipe,
		BranchNamePipe,
		BlDatePipe,
		BlcItemAddComponent,
		BlcPricePipe,
		BlCommonToggleButtonComponent

	]
})
export class BlCommonModule {
}
