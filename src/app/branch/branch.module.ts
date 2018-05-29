import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BranchRoutingModule} from './branch-routing.module';
import {BranchSelectComponent} from './branch-select/branch-select.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { BranchUploadComponent } from './branch-upload/branch-upload.component';
import { BranchEditListComponent } from './branch-edit-list/branch-edit-list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {BlCommonModule} from '../bl-common/bl-common.module';
import { BranchInfoComponent } from './branch-info/branch-info.component';
import { BranchEditComponent } from './branch-edit/branch-edit.component';
import { BranchEditPriceInfoComponent } from './branch-edit/branch-edit-price-info/branch-edit-price-info.component';

@NgModule({
	imports: [
		CommonModule,
		BranchRoutingModule,
		FontAwesomeModule,
		NgxDatatableModule,
		BlCommonModule
	],
	declarations: [
		BranchSelectComponent,
		BranchUploadComponent,
		BranchEditListComponent,
		BranchInfoComponent,
		BranchEditComponent,
		BranchEditPriceInfoComponent
	],
	exports: [
		BranchEditListComponent,
		BranchUploadComponent
	]
})
export class BranchModule {
}
