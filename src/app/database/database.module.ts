import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DatabaseRoutingModule } from "./database-routing.module";
import { DatabaseComponent } from "./database.component";
import { DatabaseItemsComponent } from "./database-items/database-items.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ItemModule } from "../item/item.module";
import { DatabaseExcelService } from "./database-excel/database-excel.service";
import { DatabaseBranchesComponent } from "./database-branches/database-branches.component";
import { BranchModule } from "../branch/branch.module";
import { DatabaseReportsComponent } from "./database-reports/database-reports.component";
import { DatabaseReportOrderComponent } from "./database-reports/database-report-order/database-report-order.component";
import { BlCommonModule } from "../bl-common/bl-common.module";
import {
	ReportDownloadModule,
	OrderDownloadComponent,
	PaymentDownloadComponent,
	CustomerItemDownloadComponent,
} from "@boklisten/bl-reporter";
import { DatabaseCompaniesComponent } from "./database-companies/database-companies.component";
import { DatabaseCompanyAddComponent } from "./database-companies/database-company-add/database-company-add.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatabaseCompanyListComponent } from "./database-companies/database-company-list/database-company-list.component";

@NgModule({
	imports: [
		CommonModule,
		DatabaseRoutingModule,
		FontAwesomeModule,
		ItemModule,
		BranchModule,
		BlCommonModule,
		ReportDownloadModule,
		ReactiveFormsModule,
	],
	providers: [DatabaseExcelService],
	declarations: [
		DatabaseComponent,
		DatabaseItemsComponent,
		DatabaseBranchesComponent,
		DatabaseReportsComponent,
		DatabaseReportOrderComponent,
		DatabaseCompaniesComponent,
		DatabaseCompanyAddComponent,
		DatabaseCompanyListComponent,
	],
})
export class DatabaseModule {}
