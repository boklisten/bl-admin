import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CompanyRoutingModule } from "./company-routing.module";
import { CompanySelectListComponent } from "./company-select-list/company-select-list.component";

@NgModule({
	declarations: [CompanySelectListComponent],
	imports: [CommonModule, CompanyRoutingModule],
	exports: [CompanySelectListComponent]
})
export class CompanyModule {}
