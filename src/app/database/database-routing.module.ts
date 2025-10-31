import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminGuardService } from "../auth/guards/admin-guard.service";
import { DatabaseComponent } from "./database.component";
import { DatabaseReportsComponent } from "./database-reports/database-reports.component";
import { DatabaseItemsComponent } from "./database-items/database-items.component";
import { DatabaseBranchesComponent } from "./database-branches/database-branches.component";
import { DatabaseCompaniesComponent } from "./database-companies/database-companies.component";
import { BranchUploadComponent } from "../branch/branch-upload/branch-upload.component";
import { BranchEditListComponent } from "../branch/branch-edit-list/branch-edit-list.component";
import { ItemUploadComponent } from "../item/item-upload/item-upload.component";
import { ItemEditListComponent } from "../item/item-edit/item-edit-list/item-edit-list.component";
import { BlNextLinkerComponent } from "../bl-next-linker/bl-next-linker.component";

const routes: Routes = [
	{
		path: "database",
		canActivate: [AdminGuardService],
		component: DatabaseComponent,
		children: [
			{
				path: "",
				redirectTo: "reports",
				pathMatch: "full",
			},
			{
				path: "reports",
				component: DatabaseReportsComponent,
			},
			{
				path: "books",
				component: DatabaseItemsComponent,
				children: [
					{
						path: "",
						redirectTo: "edit",
						pathMatch: "full",
					},
					{
						path: "edit",
						component: ItemEditListComponent,
					},
					{
						path: "upload",
						component: ItemUploadComponent,
					},
				],
			},
			{
				path: "branches",
				component: DatabaseBranchesComponent,
				children: [
					{
						path: "",
						redirectTo: "edit",
						pathMatch: "full",
					},
					{
						path: "edit",
						component: BranchEditListComponent,
					},
					{
						path: "upload",
						component: BranchUploadComponent,
					},
				],
			},
			{
				path: "companies",
				component: BlNextLinkerComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DatabaseRoutingModule {}
