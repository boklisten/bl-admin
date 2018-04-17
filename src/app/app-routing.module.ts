import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {EmployeeGuardService} from './auth/guards/employee-guard.service';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/auth/login',
		pathMatch: 'full'
	},
	{
		path: 'home',
		canActivate: [EmployeeGuardService],
		component: HomeComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {useHash: true})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
