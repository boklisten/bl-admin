import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UniqueItemDetailComponent } from "./unique-item-detail/unique-item-detail.component";

const routes: Routes = [
	{ path: "blid/:blid", component: UniqueItemDetailComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UniqueItemRoutingModule {}
