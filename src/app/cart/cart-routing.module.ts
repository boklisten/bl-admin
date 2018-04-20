import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeGuardService} from "../auth/guards/employee-guard.service";
import {BranchGuardService} from "../branch/branch-guard.service";
import {CartComponent} from "./cart.component";

const routes: Routes = [
	{
		path: 'cart',
		canActivate: [EmployeeGuardService, BranchGuardService],
		component: CartComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CartRoutingModule {
}
