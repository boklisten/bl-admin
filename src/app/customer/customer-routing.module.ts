import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeeGuardService } from "../auth/guards/employee-guard.service";
import { BranchGuardService } from "../branch/branch-guard.service";
import { CustomerDetailComponent } from "./customer-detail/customer-detail.component";
import { CustomerComponent } from "./customer.component";
import { MessengerListComponent } from "../messenger/messenger-list/messenger-list.component";

const routes: Routes = [
	{
		path: "customer",
		component: CustomerComponent,
		canActivate: [EmployeeGuardService, BranchGuardService],
		children: [
			{
				path: "",
				redirectTo: "detail",
				pathMatch: "full",
			},
			{
				path: "detail",
				component: CustomerDetailComponent,
			},
			{
				path: "messages",
				component: MessengerListComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CustomerRoutingModule {}
