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
import { InvoiceDetailComponent } from "./invoice-detail/invoice-detail.component";
import { InvoiceIdSelectComponent } from "./invoice-id-select/invoice-id-select.component";
import { InvoiceCreateComponent } from "./invoice-create/invoice-create.component";
import { ItemModule } from "../item/item.module";
import { InvoiceCreateItemListComponent } from "./invoice-create/invoice-create-item-list/invoice-create-item-list.component";
import { InvoiceCreateItemListItemComponent } from "./invoice-create/invoice-create-item-list/invoice-create-item-list-item/invoice-create-item-list-item.component";
import { CompanyModule } from "../company/company.module";

@NgModule({
	declarations: [
		InvoiceGeneratorComponent,
		InvoiceComponent,
		InvoiceTableComponent,
		InvoiceViewComponent,
		InvoiceDetailComponent,
		InvoiceIdSelectComponent,
		InvoiceCreateComponent,
		InvoiceCreateItemListComponent,
		InvoiceCreateItemListItemComponent
	],
	imports: [
		CommonModule,
		InvoiceRoutingModule,
		BlCommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		FontAwesomeModule,
		ItemModule,
		CompanyModule
	],
	exports: [InvoiceComponent]
})
export class InvoiceModule {}
