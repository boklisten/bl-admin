import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BookingComponent } from "./booking.component";
import { EmployeeGuardService } from "../auth/guards/employee-guard.service";

const routes: Routes = [
	{
		path: "booking",
		canActivate: [EmployeeGuardService],
		component: BookingComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BookingRoutingModule {}
