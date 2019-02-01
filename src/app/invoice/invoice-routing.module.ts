import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InvoiceComponent } from "./invoice.component";
import { AdminGuardService } from "../auth/guards/admin-guard.service";

const routes: Routes = [
	{
		path: "invoices",
		component: InvoiceComponent,
		canActivate: [AdminGuardService]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class InvoiceRoutingModule {}
