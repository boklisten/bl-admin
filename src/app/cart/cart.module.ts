import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CartRoutingModule} from './cart-routing.module';
import {CartComponent} from './cart.component';
import {CartListComponent} from './cart-list/cart-list.component';
import {ItemModule} from "../item/item.module";
import {OrderModule} from "../order/order.module";
import {NgbButtonsModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {BlCommonModule} from "../bl-common/bl-common.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { CartListItemComponent } from './cart-list/cart-list-item/cart-list-item.component';
import {FormsModule} from '@angular/forms';
import { CartListItemActionComponent } from './cart-list/cart-list-item/cart-list-item-action/cart-list-item-action.component';
import {CustomerOrderResolverService} from '../order/customer-order/customer-order-resolver.service';

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
		NgbButtonsModule
	],
	declarations: [
		CartComponent,
		CartListComponent,
		CartListItemComponent,
		CartListItemActionComponent
	],
	providers: [
		CustomerOrderResolverService
	]
})
export class CartModule {
}
