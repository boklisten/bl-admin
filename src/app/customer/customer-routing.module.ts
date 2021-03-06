import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeGuardService} from '../auth/guards/employee-guard.service';
import {BranchGuardService} from '../branch/branch-guard.service';
import {CustomerDetailComponent} from './customer-detail/customer-detail.component';

const routes: Routes = [
	{
		path: 'customer',
		canActivate: [EmployeeGuardService, BranchGuardService],
		children: [
			{
				path: ':id/detail',
				component: CustomerDetailComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CustomerRoutingModule {
}
