import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ScannerRoutingModule } from "./scanner-routing.module";
import { ScannerComponent } from "./scanner.component";
import { ItemModule } from "../item/item.module";
import { UidScannerListComponent } from "./uid-scanner-list/uid-scanner-list.component";

@NgModule({
	declarations: [ScannerComponent, UidScannerListComponent],
	imports: [
		CommonModule,
		ScannerRoutingModule,
		ItemModule,
		BlCommonModule,
		FontAwesomeModule
	]
})
export class ScannerModule {}
