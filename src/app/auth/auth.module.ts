import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminGuardService} from './guards/admin-guard.service';
import {EmployeeGuardService} from './guards/employee-guard.service';
import {UserGuardService} from './guards/user-guard.service';
import {AuthService} from './auth.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		AuthService,
		AdminGuardService,
		EmployeeGuardService,
		UserGuardService
	],
	declarations: []
})
export class AuthModule {
}
