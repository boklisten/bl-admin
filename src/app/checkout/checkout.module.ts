import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CheckoutComponent } from "./checkout.component";
import { CustomerModule } from "../customer/customer.module";
import { OrderModule } from "../order/order.module";
import { PaymentModule } from "../payment/payment.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
	declarations: [CheckoutComponent],
	imports: [
		CommonModule,
		CustomerModule,
		OrderModule,
		PaymentModule,
		FontAwesomeModule
	],
	exports: [CheckoutComponent]
})
export class CheckoutModule {}
