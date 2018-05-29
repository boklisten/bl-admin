import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BranchRoutingModule} from './branch-routing.module';
import {BranchSelectComponent} from './branch-select/branch-select.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { BranchUploadComponent } from './branch-upload/branch-upload.component';
import { BranchEditListComponent } from './branch-edit-list/branch-edit-list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {BlCommonModule} from '../bl-common/bl-common.module';

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
		BranchEditListComponent
	],
	exports: [
		BranchEditListComponent,
		BranchUploadComponent
	]
})
export class BranchModule {
}
