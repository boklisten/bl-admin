import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeGuardService} from '../auth/guards/employee-guard.service';
import {BranchSelectComponent} from './branch-select/branch-select.component';

const routes: Routes = [
	{
		path: 'branch',
		canActivate: [EmployeeGuardService],
		children: [
			{
				path: 'select',
				component: BranchSelectComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BranchRoutingModule {
}
