import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeeGuardService } from "../auth/guards/employee-guard.service";
import { BranchGuardService } from "../branch/branch-guard.service";
import { ItemSearchComponent } from "../item/item-search/item-search.component";
import { CartCustomerComponent } from "./cart-customer/cart-customer.component";
import { CartComponent } from "./cart.component";

const routes: Routes = [
	{
		path: "cart",
		canActivate: [EmployeeGuardService, BranchGuardService],
		component: CartComponent,
		children: [
			{ path: "", redirectTo: "customer", pathMatch: "full" },
			{ path: "customer", component: CartCustomerComponent },
			{ path: "search", component: ItemSearchComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CartRoutingModule {}
