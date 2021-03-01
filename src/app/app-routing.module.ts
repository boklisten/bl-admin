import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { EmployeeGuardService } from "./auth/guards/employee-guard.service";
import { BranchGuardService } from "./branch/branch-guard.service";

const routes: Routes = [
	{
		path: "",
		redirectTo: "/home",
		pathMatch: "full",
	},
	{
		path: "home",
		canActivate: [EmployeeGuardService, BranchGuardService],
		component: HomeComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
