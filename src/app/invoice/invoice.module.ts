import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InvoiceRoutingModule } from "./invoice-routing.module";
import { InvoiceGeneratorComponent } from "./invoice-generator/invoice-generator.component";
import { InvoiceComponent } from "./invoice.component";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [InvoiceGeneratorComponent, InvoiceComponent],
	imports: [CommonModule, InvoiceRoutingModule, BlCommonModule, FormsModule],
	exports: [InvoiceComponent]
})
export class InvoiceModule {}
