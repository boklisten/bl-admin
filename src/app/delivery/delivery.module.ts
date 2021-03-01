import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DeliveryDetailComponent } from "./delivery-detail/delivery-detail.component";
import { DeliveryTrackingNumberEditComponent } from "./delivery-tracking-number-edit/delivery-tracking-number-edit.component";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
	declarations: [
		DeliveryDetailComponent,
		DeliveryTrackingNumberEditComponent,
	],
	imports: [CommonModule, FormsModule, FontAwesomeModule],
	exports: [DeliveryDetailComponent, DeliveryTrackingNumberEditComponent],
})
export class DeliveryModule {}
