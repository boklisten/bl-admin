import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeGuardService} from '../auth/guards/employee-guard.service';
import {BranchGuardService} from '../branch/branch-guard.service';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {ManagerGuardService} from '../auth/guards/manager-guard.service';
import {OrderManagerComponent} from './order-manager/order-manager.component';

const routes: Routes = [
	{
		path: 'order',
		canActivate: [EmployeeGuardService, BranchGuardService],
		children: [
			{
				path: ':id/detail',
				component: OrderDetailComponent
			}
		]
	},
	{
		path: 'orders',
		canActivate: [ManagerGuardService],
		component: OrderManagerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class OrderRoutingModule {
}
