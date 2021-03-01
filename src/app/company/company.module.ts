import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CompanyRoutingModule } from "./company-routing.module";
import { CompanySelectListComponent } from "./company-select-list/company-select-list.component";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
	declarations: [CompanySelectListComponent],
	imports: [CommonModule, CompanyRoutingModule, FontAwesomeModule],
	exports: [CompanySelectListComponent],
})
export class CompanyModule {}
