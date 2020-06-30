import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UniqueItemRegisterComponent } from "./unique-item-register/unique-item-register.component";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { ScannerModule } from "../scanner/scanner.module";
import { ItemModule } from "../item/item.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
	declarations: [UniqueItemRegisterComponent],
	imports: [
		CommonModule,
		BlCommonModule,
		ScannerModule,
		ItemModule,
		FontAwesomeModule
	],
	exports: [UniqueItemRegisterComponent]
})
export class UniqueItemModule {}
