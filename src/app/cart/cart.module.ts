import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CartRoutingModule} from './cart-routing.module';
import {CartComponent} from './cart.component';
import {CartListComponent} from './cart-list/cart-list.component';
import {ItemModule} from "../item/item.module";
import {OrderModule} from "../order/order.module";
import {NgbButtonsModule, NgbModalModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {BlCommonModule} from "../bl-common/bl-common.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { CartListItemComponent } from './cart-list/cart-list-item/cart-list-item.component';
import {FormsModule} from '@angular/forms';
import { CartListItemActionComponent } from './cart-list/cart-list-item/cart-list-item-action/cart-list-item-action.component';
import {CustomerOrderResolverService} from '../order/customer-order/customer-order-resolver.service';
import { CartConfirmComponent } from './cart-confirm/cart-confirm.component';
import { CartListSmallComponent } from './cart-list-small/cart-list-small.component';
import {CartHelperService} from './cart-helper.service';
import {CustomerModule} from '../customer/customer.module';
import {CartConfirmService} from './cart-confirm/cart-confirm.service';
import {PaymentModule} from '../payment/payment.module';
import {CustomerItemModule} from '../customer-item/customer-item.module';

@NgModule({
	imports: [
		CommonModule,
		ItemModule,
		CartRoutingModule,
		OrderModule,
		NgbTabsetModule,
		BlCommonModule,
		FontAwesomeModule,
		FormsModule,
		NgbButtonsModule,
		NgbModalModule,
		CustomerModule,
		OrderModule,
		PaymentModule,
		CustomerItemModule
	],
	declarations: [
		CartComponent,
		CartListComponent,
		CartListItemComponent,
		CartListItemActionComponent,
		CartConfirmComponent,
		CartListSmallComponent
	],
	providers: [
		CustomerOrderResolverService,
		CartHelperService,
		CartConfirmService
	]
})
export class CartModule {
}
