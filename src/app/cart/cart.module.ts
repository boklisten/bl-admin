import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CartRoutingModule} from './cart-routing.module';
import {CartComponent} from './cart.component';
import {CartListComponent} from './cart-list/cart-list.component';
import {ItemModule} from "../item/item.module";
import {OrderModule} from "../order/order.module";
import {NgbTabsetModule} from "@ng-bootstrap/ng-bootstrap";
import {BlCommonModule} from "../bl-common/bl-common.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
	imports: [
		CommonModule,
		ItemModule,
		CartRoutingModule,
		OrderModule,
		NgbTabsetModule,
		BlCommonModule,
		FontAwesomeModule
	],
	declarations: [CartComponent, CartListComponent]
})
export class CartModule {
}
