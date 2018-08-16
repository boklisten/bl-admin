import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SearchComponent} from './search.component';
import {EmployeeGuardService} from '../auth/guards/employee-guard.service';
import {BranchGuardService} from '../branch/branch-guard.service';
import {CustomerResultComponent} from './customer/customer-result/customer-result.component';

const routes: Routes = [
	{
		path: 'search',
		component: SearchComponent,
		canActivate: [EmployeeGuardService, BranchGuardService]
	},
	{
		path: 'search/customer/result',
		component: CustomerResultComponent,
		canActivate: [EmployeeGuardService, BranchGuardService]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SearchRoutingModule {
}
