import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserComponent} from './user.component';
import {EmployeeGuardService} from '../auth/guards/employee-guard.service';

const routes: Routes = [
	{
		path: 'user',
		component: UserComponent,
		canActivate: [EmployeeGuardService]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UserRoutingModule {
}
