import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ScannerRoutingModule } from "./scanner-routing.module";
import { ScannerComponent } from "./scanner.component";
import { ItemModule } from "../item/item.module";
import { BlidScannerListComponent } from "./blid-scanner-list/blid-scanner-list.component";
import { BlidScannerListItemComponent } from './blid-scanner-list/blid-scanner-list-item/blid-scanner-list-item.component';

@NgModule({
	declarations: [ScannerComponent, BlidScannerListComponent, BlidScannerListItemComponent],
	imports: [
		CommonModule,
		ScannerRoutingModule,
		ItemModule,
		BlCommonModule,
		FontAwesomeModule
	]
})
export class ScannerModule {}
