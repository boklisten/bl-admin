import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminGuardService} from './guards/admin-guard.service';
import {EmployeeGuardService} from './guards/employee-guard.service';
import {UserGuardService} from './guards/user-guard.service';
import {AuthService} from './auth.service';
import {ManagerGuardService} from './guards/manager-guard.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		AuthService,
		AdminGuardService,
		EmployeeGuardService,
		UserGuardService,
		ManagerGuardService
	],
	declarations: []
})
export class AuthModule {
}
