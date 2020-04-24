import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BookingRoutingModule } from "./booking-routing.module";
import { BookingComponent } from "./booking.component";
import { BookingCreateComponent } from "./booking-create/booking-create.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { BookingListComponent } from "./booking-list/booking-list.component";
import { BlCommonModule } from "../bl-common/bl-common.module";

@NgModule({
	declarations: [
		BookingComponent,
		BookingCreateComponent,
		BookingListComponent
	],
	imports: [
		CommonModule,
		BookingRoutingModule,
		FontAwesomeModule,
		ReactiveFormsModule,
		NgbTimepickerModule,
		FormsModule,
		BlCommonModule
	]
})
export class BookingModule {}
