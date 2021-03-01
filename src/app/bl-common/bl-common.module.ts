import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BlCommonUpdateButtonComponent } from "./bl-common-update-button/bl-common-update-button.component";
import {
	FaIconLibrary,
	FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCircleNotch,
	faCheckCircle,
	faExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { BlCommonAlertComponent } from "./bl-common-alert/bl-common-alert.component";
import {
	NgbAlertModule,
	NgbButtonsModule,
	NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { BlSearchBarComponent } from "./search/bl-search-bar/bl-search-bar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomerNamePipe } from "./pipes/customer/customer-name.pipe";
import { BranchNamePipe } from "./pipes/branch/branch-name.pipe";
import { BlDatePipe } from "./pipes/date/bl-date.pipe";
import { BlcItemAddComponent } from "./blc-item-add/blc-item-add.component";
import { BlcPricePipe } from "./pipes/price/blc-price.pipe";
import { BlCommonToggleButtonComponent } from "./bl-common-button/bl-common-toggle-button/bl-common-toggle-button.component";
import { BlcDatatableStringCellComponent } from "./datatable/blc-datatable-string-cell/blc-datatable-string-cell.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { BlcEditStringValueComponent } from "./blc-edit/blc-edit-string-value/blc-edit-string-value.component";
import { BlcEditNumberValueComponent } from "./blc-edit/blc-edit-number-value/blc-edit-number-value.component";
import { BlcEditDateValueComponent } from "./blc-edit/blc-edit-date-value/blc-edit-date-value.component";
import { BlcScannerDirective } from "./blc-scanner/blc-scanner.directive";
import { BlcKeyeventDoubleShiftDirective } from "./blc-keyevent/blc-keyevent-double-shift.directive";
import { BlcPeriodSelectComponent } from "./blc-period/blc-period-select/blc-period-select.component";
import { BlcButtonCheckComponent } from "./blc-button-check/blc-button-check.component";
import { BlPrintComponent } from "./bl-print/bl-print.component";
import { BlcDeadlineSelectComponent } from "./blc-deadline-select/blc-deadline-select.component";
import { BlcTextblockEditComponent } from "./blc-textblock-edit/blc-textblock-edit.component";
import { BlcBranchSelectComponent } from "./blc-branch/blc-branch-select/blc-branch-select.component";
import { BlcTypeSelectComponent } from "./blc-type-select/blc-type-select.component";
import { BlcArrowDownEventDirective } from "./blc-key/blc-arrow-down-event.directive";
import { BlcArrowUpEventDirective } from "./blc-key/blc-arrow-up/blc-arrow-up.directive";
import { BlcEnterEventDirective } from "./blc-key/blc-enter/blc-enter.directive";
import { BlcClickDirective } from "./blc-click/blc-click.directive";
import { BlcBlidComponent } from "./blc-blid/blc-blid.component";
import { BlNavComponent } from "./bl-nav/bl-nav.component";

@NgModule({
	imports: [
		CommonModule,
		NgbAlertModule,
		FontAwesomeModule,
		FormsModule,
		NgbTooltipModule,
		NgxDatatableModule,
		ReactiveFormsModule,
		NgbButtonsModule,
		RouterModule,
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
		BlCommonToggleButtonComponent,
		BlcDatatableStringCellComponent,
		BlcEditStringValueComponent,
		BlcEditNumberValueComponent,
		BlcEditDateValueComponent,
		BlcScannerDirective,
		BlcKeyeventDoubleShiftDirective,
		BlcPeriodSelectComponent,
		BlcButtonCheckComponent,
		BlPrintComponent,
		BlcDeadlineSelectComponent,
		BlcTextblockEditComponent,
		BlcBranchSelectComponent,
		BlcTypeSelectComponent,
		BlcArrowDownEventDirective,
		BlcArrowUpEventDirective,
		BlcEnterEventDirective,
		BlcClickDirective,
		BlcBlidComponent,
		BlNavComponent,
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
		BlCommonToggleButtonComponent,
		BlcDatatableStringCellComponent,
		BlcEditStringValueComponent,
		BlcEditNumberValueComponent,
		BlcEditDateValueComponent,
		BlcScannerDirective,
		BlcKeyeventDoubleShiftDirective,
		BlcPeriodSelectComponent,
		BlcButtonCheckComponent,
		BlcDeadlineSelectComponent,
		BlcTextblockEditComponent,
		BlcBranchSelectComponent,
		BlcTypeSelectComponent,
		BlcArrowDownEventDirective,
		BlcArrowUpEventDirective,
		BlcEnterEventDirective,
		BlcClickDirective,
		BlcBlidComponent,
		BlNavComponent,
	],
})
export class BlCommonModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faCircleNotch, faCheckCircle, faExclamation);
	}
}
