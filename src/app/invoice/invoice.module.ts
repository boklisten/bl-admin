import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InvoiceRoutingModule } from "./invoice-routing.module";
import { InvoiceGeneratorComponent } from "./invoice-generator/invoice-generator.component";
import { InvoiceComponent } from "./invoice.component";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InvoiceTableComponent } from "./invoice-table/invoice-table.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InvoiceViewComponent } from "./invoice-view/invoice-view.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvoiceIdSelectComponent } from './invoice-id-select/invoice-id-select.component';

@NgModule({
	declarations: [
		InvoiceGeneratorComponent,
		InvoiceComponent,
		InvoiceTableComponent,
		InvoiceViewComponent,
		InvoiceDetailComponent,
		InvoiceIdSelectComponent
	],
	imports: [
		CommonModule,
		InvoiceRoutingModule,
		BlCommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		FontAwesomeModule
	],
	exports: [InvoiceComponent]
})
export class InvoiceModule {}
