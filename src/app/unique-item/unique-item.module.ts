import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UniqueItemRegisterComponent } from "./unique-item-register/unique-item-register.component";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { ScannerModule } from "../scanner/scanner.module";
import { ItemModule } from "../item/item.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UniqueItemScanToCartComponent } from "./unique-item-scan-to-cart/unique-item-scan-to-cart.component";
import { UniqueItemRegisterFromCartComponent } from "./unique-item-register-from-cart/unique-item-register-from-cart.component";
import { UniqueItemScanOrderToCartComponent } from "./unique-item-scan-order-to-cart/unique-item-scan-order-to-cart.component";
import { UniqueItemDetailComponent } from "./unique-item-detail/unique-item-detail.component";
import { UniqueItemRoutingModule } from "./unique-item-routing.module";
import { UniqueItemCustomerItemListComponent } from "./unique-item-detail/unique-item-customer-item-list/unique-item-customer-item-list.component";
import { CustomerItemModule } from "../customer-item/customer-item.module";

@NgModule({
	declarations: [
		UniqueItemRegisterComponent,
		UniqueItemScanToCartComponent,
		UniqueItemRegisterFromCartComponent,
		UniqueItemScanOrderToCartComponent,
		UniqueItemDetailComponent,
		UniqueItemCustomerItemListComponent
	],
	imports: [
		CommonModule,
		BlCommonModule,
		ScannerModule,
		ItemModule,
		FontAwesomeModule,
		UniqueItemRoutingModule,
		CustomerItemModule
	],
	exports: [
		UniqueItemRegisterComponent,
		UniqueItemScanToCartComponent,
		UniqueItemRegisterFromCartComponent,
		UniqueItemScanOrderToCartComponent
	]
})
export class UniqueItemModule {}
