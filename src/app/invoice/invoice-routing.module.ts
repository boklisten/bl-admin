import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InvoiceDetailComponent } from "./invoice-detail/invoice-detail.component";
import { InvoiceComponent } from "./invoice.component";
import { AdminGuardService } from "../auth/guards/admin-guard.service";
import { InvoiceViewComponent } from "./invoice-view/invoice-view.component";
import { InvoiceGeneratorComponent } from "./invoice-generator/invoice-generator.component";
import { InvoiceCreateComponent } from "./invoice-create/invoice-create.component";

const routes: Routes = [
	{
		path: "invoices",
		component: InvoiceComponent,
		canActivate: [AdminGuardService],
		children: [
			{
				path: "",
				redirectTo: "view",
				pathMatch: "full",
			},
			{
				path: "view",
				component: InvoiceViewComponent,
			},
			{
				path: "generate",
				component: InvoiceGeneratorComponent,
			},
			{
				path: "create",
				component: InvoiceCreateComponent,
			},
			{
				path: "",
				pathMatch: "full",
				redirectTo: "view",
			},
		],
	},
	{
		path: "invoice/:id",
		component: InvoiceDetailComponent,
		canActivate: [AdminGuardService],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class InvoiceRoutingModule {}
