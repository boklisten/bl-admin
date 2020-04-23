import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BookingComponent } from "./booking.component";
import { EmployeeGuardService } from "../auth/guards/employee-guard.service";
import { BookingCreateComponent } from "./booking-create/booking-create.component";

const routes: Routes = [
	{
		path: "booking",
		canActivate: [EmployeeGuardService],
		component: BookingComponent,
		children: [
			{
				path: "create",
				component: BookingCreateComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BookingRoutingModule {}
