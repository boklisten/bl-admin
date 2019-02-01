import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InvoiceRoutingModule } from "./invoice-routing.module";
import { InvoiceGeneratorComponent } from "./invoice-generator/invoice-generator.component";
import { InvoiceComponent } from "./invoice.component";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InvoiceTableComponent } from "./invoice-table/invoice-table.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
	declarations: [
		InvoiceGeneratorComponent,
		InvoiceComponent,
		InvoiceTableComponent
	],
	imports: [
		CommonModule,
		InvoiceRoutingModule,
		BlCommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [InvoiceComponent]
})
export class InvoiceModule {}
