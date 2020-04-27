import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BookingComponent } from "./booking.component";
import { EmployeeGuardService } from "../auth/guards/employee-guard.service";
import { AdminGuardService } from "../auth/guards/admin-guard.service";
import { BookingCreateComponent } from "./booking-create/booking-create.component";
import { BookingViewComponent } from "./booking-view/booking-view.component";

const routes: Routes = [
	{
		path: "booking",
		canActivate: [EmployeeGuardService],
		component: BookingComponent,
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "view"
			},
			{
				path: "create",
				canActivate: [AdminGuardService],
				component: BookingCreateComponent
			},
			{
				path: "view",
				component: BookingViewComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BookingRoutingModule {}
