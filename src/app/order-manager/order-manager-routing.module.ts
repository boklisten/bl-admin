import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrderManagerComponent } from "./order-manager.component";

const routes: Routes = [
	{
		path: "order-manager",
		component: OrderManagerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class OrderManagerRoutingModule {}
