import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ScannerRoutingModule } from "./scanner-routing.module";
import { ScannerComponent } from "./scanner.component";
import { ItemModule } from "../item/item.module";
import { BlidScannerListComponent } from "./blid-scanner-list/blid-scanner-list.component";
import { BlidScannerListItemComponent } from "./blid-scanner-list/blid-scanner-list-item/blid-scanner-list-item.component";
import { BlidScannerInputComponent } from "./blid-scanner-input/blid-scanner-input.component";
import { FormsModule } from "@angular/forms";
import { IsbnScannerAddToCartComponent } from "./isbn-scanner/isbn-scanner-add-to-cart/isbn-scanner-add-to-cart.component";

@NgModule({
	declarations: [
		ScannerComponent,
		BlidScannerListComponent,
		BlidScannerListItemComponent,
		BlidScannerInputComponent,
		IsbnScannerAddToCartComponent
	],
	imports: [
		CommonModule,
		ScannerRoutingModule,
		ItemModule,
		BlCommonModule,
		FontAwesomeModule,
		FormsModule
	],
	exports: [IsbnScannerAddToCartComponent]
})
export class ScannerModule {}
