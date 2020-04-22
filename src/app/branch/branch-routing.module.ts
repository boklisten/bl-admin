import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeeGuardService } from "../auth/guards/employee-guard.service";
import { BranchSelectComponent } from "./branch-select/branch-select.component";
import { BranchInfoComponent } from "./branch-info/branch-info.component";
import { BranchEditComponent } from "./branch-edit/branch-edit.component";
import { AdminGuardService } from "../auth/guards/admin-guard.service";

const routes: Routes = [
	{
		path: "branch",
		canActivate: [EmployeeGuardService],
		children: [
			{
				path: "select",
				component: BranchSelectComponent
			},
			{
				path: ":id/info",
				component: BranchInfoComponent
			},
			{
				path: ":id/edit",
				canActivate: [AdminGuardService],
				component: BranchEditComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BranchRoutingModule {}
