import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeeGuardService } from "../auth/guards/employee-guard.service";
import { BulkCollectionComponent } from "./bulk-collection.component";

const routes: Routes = [
	{
		path: "bulk",
		canActivate: [EmployeeGuardService],
		component: BulkCollectionComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BulkCollectionRoutingModule {}
