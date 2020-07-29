import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DeliveryDetailComponent } from "./delivery-detail/delivery-detail.component";

@NgModule({
	declarations: [DeliveryDetailComponent],
	imports: [CommonModule],
	exports: [DeliveryDetailComponent]
})
export class DeliveryModule {}
