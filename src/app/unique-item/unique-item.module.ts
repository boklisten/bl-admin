import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UniqueItemRegisterComponent } from "./unique-item-register/unique-item-register.component";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { ScannerModule } from "../scanner/scanner.module";
import { ItemModule } from "../item/item.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UniqueItemScanToCartComponent } from "./unique-item-scan-to-cart/unique-item-scan-to-cart.component";

@NgModule({
	declarations: [UniqueItemRegisterComponent, UniqueItemScanToCartComponent],
	imports: [
		CommonModule,
		BlCommonModule,
		ScannerModule,
		ItemModule,
		FontAwesomeModule
	],
	exports: [UniqueItemRegisterComponent, UniqueItemScanToCartComponent]
})
export class UniqueItemModule {}
