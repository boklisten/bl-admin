import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CartRoutingModule } from "./cart-routing.module";
import { CartComponent } from "./cart.component";
import { CartListComponent } from "./cart-list/cart-list.component";
import { ItemModule } from "../item/item.module";
import { OrderModule } from "../order/order.module";
import {
	NgbButtonsModule,
	NgbModalModule,
	NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CartListItemComponent } from "./cart-list/cart-list-item/cart-list-item.component";
import { FormsModule } from "@angular/forms";
import { CartListItemActionComponent } from "./cart-list/cart-list-item/cart-list-item-action/cart-list-item-action.component";
import { CustomerModule } from "../customer/customer.module";
import { PaymentModule } from "../payment/payment.module";
import { CustomerItemModule } from "../customer-item/customer-item.module";
import { CartDeliveryComponent } from "./cart-delivery/cart-delivery.component";
import { CartItemSearchService } from "./cart-item-search/cart-item-search.service";
import { CustomerItemListService } from "../customer-item/customer-item-list/customer-item-list.service";
import { CustomerOrderItemListService } from "../order/customer-order/customer-order-item-list/customer-order-item-list.service";
import { CartListItemAgeComponent } from "./cart-list/cart-list-item/cart-list-item-age/cart-list-item-age.component";
import { CartListItemAmountComponent } from "./cart-list/cart-list-item/cart-list-item-amount/cart-list-item-amount.component";
import { CartItemService } from "./cart-item/cart-item.service";
import { CheckoutModule } from "../checkout/checkout.module";
import { UniqueItemModule } from "../unique-item/unique-item.module";
import { ScannerModule } from "../scanner/scanner.module";
import { CartCustomerComponent } from "./cart-customer/cart-customer.component";

@NgModule({
	imports: [
		CommonModule,
		ItemModule,
		CartRoutingModule,
		OrderModule,
		BlCommonModule,
		FontAwesomeModule,
		FormsModule,
		NgbButtonsModule,
		NgbModalModule,
		NgbTooltipModule,
		CustomerModule,
		OrderModule,
		PaymentModule,
		CustomerItemModule,
		CheckoutModule,
		UniqueItemModule,
		ScannerModule,
	],
	declarations: [
		CartComponent,
		CartListComponent,
		CartListItemComponent,
		CartListItemActionComponent,
		CartDeliveryComponent,
		CartListItemAgeComponent,
		CartListItemAmountComponent,
		CartCustomerComponent,
	],
	providers: [
		CartItemSearchService,
		CustomerItemListService,
		CustomerOrderItemListService,
		CartItemService,
	],
	exports: [CartListComponent],
})
export class CartModule {}
