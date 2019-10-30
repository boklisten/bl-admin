import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlCommonUpdateButtonComponent } from "./bl-common-update-button/bl-common-update-button.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCircleNotch,
	faCheckCircle,
	faExclamation
} from "@fortawesome/free-solid-svg-icons";
import { BlCommonAlertComponent } from "./bl-common-alert/bl-common-alert.component";
import {
	NgbAlertModule,
	NgbButtonsModule,
	NgbTooltipModule
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

library.add(faCircleNotch, faCheckCircle, faExclamation);

@NgModule({
	imports: [
		CommonModule,
		NgbAlertModule,
		FontAwesomeModule,
		FormsModule,
		NgbTooltipModule,
		NgxDatatableModule,
		ReactiveFormsModule,
		NgbButtonsModule
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
		BlcTypeSelectComponent
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
		BlcTypeSelectComponent
	]
})
export class BlCommonModule {}
