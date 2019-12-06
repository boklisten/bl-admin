import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BranchRoutingModule } from "./branch-routing.module";
import { BranchSelectComponent } from "./branch-select/branch-select.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BranchUploadComponent } from "./branch-upload/branch-upload.component";
import { BranchEditListComponent } from "./branch-edit-list/branch-edit-list.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { BranchInfoComponent } from "./branch-info/branch-info.component";
import { BranchEditComponent } from "./branch-edit/branch-edit.component";
import { BranchEditItemsComponent } from "./branch-edit/branch-edit-items/branch-edit-items.component";
import { ItemModule } from "../item/item.module";
import { BranchItemHandlerService } from "./branch-item/branch-item-handler.service";
import { BranchItemEditComponent } from "./branch-edit/branch-edit-items/branch-item-edit/branch-item-edit.component";
import { BranchItemCategorySelectComponent } from "./branch-edit/branch-edit-items/branch-item-category-select/branch-item-category-select.component";
import {
	NgbAccordionModule,
	NgbDatepickerModule,
	NgbPopoverModule,
	NgbTimepickerModule
} from "@ng-bootstrap/ng-bootstrap";
import { BranchItemCategorySelectService } from "./branch-edit/branch-edit-items/branch-item-category-select/branch-item-category-select.service";
import { FormsModule } from "@angular/forms";
import { BranchOpeningHoursEditComponent } from "./branch-edit/branch-opening-hours-edit/branch-opening-hours-edit.component";
import { OpeningHoursHandlerService } from "./branch-edit/branch-opening-hours-edit/opening-hours-handler.service";
import { BranchItemHelperService } from "./branch-item-helper/branch-item-helper.service";
import { BranchEditPeriodSettingsComponent } from "./branch-edit/branch-edit-period-settings/branch-edit-period-settings.component";
import { BranchHelperService } from "./branch-helper/branch-helper.service";
import { BranchCurrentComponent } from "./branch-current/branch-current.component";

@NgModule({
	imports: [
		CommonModule,
		BranchRoutingModule,
		FontAwesomeModule,
		NgxDatatableModule,
		BlCommonModule,
		ItemModule,
		NgbPopoverModule,
		FormsModule,
		NgbAccordionModule,
		NgbTimepickerModule,
		NgbDatepickerModule
	],
	declarations: [
		BranchSelectComponent,
		BranchUploadComponent,
		BranchEditListComponent,
		BranchInfoComponent,
		BranchEditComponent,
		BranchEditPeriodSettingsComponent,
		BranchEditItemsComponent,
		BranchItemEditComponent,
		BranchItemCategorySelectComponent,
		BranchOpeningHoursEditComponent,
		BranchCurrentComponent
	],
	providers: [
		BranchItemHandlerService,
		BranchItemCategorySelectService,
		OpeningHoursHandlerService,
		BranchItemHelperService,
		BranchHelperService
	],
	exports: [
		BranchEditListComponent,
		BranchUploadComponent,
		BranchCurrentComponent
	]
})
export class BranchModule {}
