import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OrderManagerRoutingModule } from "./order-manager-routing.module";

import { OrderManagerComponent } from "./order-manager.component";
import { OrderManagerListComponent } from "./order-manager-list/order-manager-list.component";
import { OrderManagerListService } from "./order-manager-list/order-manager-list.service";
import { OrderManagerListItemComponent } from "./order-manager-list/order-manager-list-item/order-manager-list-item.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { OrderModule } from "../order/order.module";
import { CartModule } from "../cart/cart.module";
import { CheckoutModule } from "../checkout/checkout.module";
import { UniqueItemModule } from "../unique-item/unique-item.module";

@NgModule({
	declarations: [
		OrderManagerComponent,
		OrderManagerListComponent,
		OrderManagerListItemComponent,
	],
	imports: [
		CommonModule,
		OrderManagerRoutingModule,
		FontAwesomeModule,
		BlCommonModule,
		OrderModule,
		CartModule,
		CheckoutModule,
		UniqueItemModule,
	],
	providers: [OrderManagerListService],
})
export class OrderManagerModule {}
