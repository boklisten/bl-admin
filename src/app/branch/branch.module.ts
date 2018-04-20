import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BranchRoutingModule} from './branch-routing.module';
import {BranchSelectComponent} from './branch-select/branch-select.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
	imports: [
		CommonModule,
		BranchRoutingModule,
		FontAwesomeModule
	],
	declarations: [BranchSelectComponent],
})
export class BranchModule {
}
