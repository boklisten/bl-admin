import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PaymentRoutingModule} from './payment-routing.module';
import {PaymentComponent} from './payment.component';
import {PaymentHandlerService} from './payment-handler/payment-handler.service';
import { PaymentMethodSelectComponent } from './payment-method-select/payment-method-select.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	imports: [
		CommonModule,
		PaymentRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		FontAwesomeModule,
		NgbButtonsModule
	],
	declarations: [PaymentComponent, PaymentMethodSelectComponent],
	exports: [
		PaymentComponent
	],
	providers: [
		PaymentHandlerService
	]
})
export class PaymentModule {
}
