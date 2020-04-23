import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BookingRoutingModule } from "./booking-routing.module";
import { BookingComponent } from "./booking.component";
import { BookingCreateComponent } from "./booking-create/booking-create.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
	declarations: [BookingComponent, BookingCreateComponent],
	imports: [
		CommonModule,
		BookingRoutingModule,
		FontAwesomeModule,
		//FormsModule,
		ReactiveFormsModule
	]
})
export class BookingModule {}
