import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrderRoutingModule} from './order-routing.module';
import {CustomerOrderListComponent} from './customer-order/customer-order-list/customer-order-list.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BlCommonModule} from '../bl-common/bl-common.module';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {OrderPaymentDetailComponent} from './order-detail/order-payment-detail/order-payment-detail.component';
import {OrderDetailCardComponent} from './order-detail/order-detail-card/order-detail-card.component';
import {OrderDeliveryDetailComponent} from './order-detail/order-delivery-detail/order-delivery-detail.component';
import {OrderItemListComponent} from './order-detail/order-item-list/order-item-list.component';
import { OrderItemDetailListComponent } from './order-detail/order-item-detail-list/order-item-detail-list.component';
import {BranchModule} from "../branch/branch.module";
import {CustomerModule} from "../customer/customer.module";

@NgModule({
	imports: [
		CommonModule,
		OrderRoutingModule,
		FontAwesomeModule,
		BlCommonModule,
	],
	declarations: [
		CustomerOrderListComponent,
		OrderDetailComponent,
		OrderPaymentDetailComponent,
		OrderDetailCardComponent,
		OrderDeliveryDetailComponent,
		OrderItemListComponent,
		OrderItemDetailListComponent
	],
	exports: [
		CustomerOrderListComponent
	]
})
export class OrderModule {
}
