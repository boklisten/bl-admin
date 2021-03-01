import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeeGuardService } from "../auth/guards/employee-guard.service";
import { BranchGuardService } from "../branch/branch-guard.service";
import { CustomerItemDetailComponent } from "./customer-item-detail/customer-item-detail.component";

const routes: Routes = [
	{
		path: "customerItem",
		canActivate: [EmployeeGuardService, BranchGuardService],
		children: [
			{
				path: ":id/detail",
				component: CustomerItemDetailComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CustomerItemRoutingModule {}
