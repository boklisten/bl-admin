import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DatabaseRoutingModule} from './database-routing.module';
import {DatabaseComponent} from './database.component';
import {DatabaseItemsComponent} from './database-items/database-items.component';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ItemModule} from '../item/item.module';
import {DatabaseExcelService} from './database-excel/database-excel.service';
import { DatabaseBranchesComponent } from './database-branches/database-branches.component';
import {BranchModule} from '../branch/branch.module';
import { DatabaseReportsComponent } from './database-reports/database-reports.component';
import { DatabaseReportOrderComponent } from './database-reports/database-report-order/database-report-order.component';
import {BlCommonModule} from '../bl-common/bl-common.module';
import { ReportDownloadModule, OrderDownloadComponent, PaymentDownloadComponent, CustomerItemDownloadComponent } from  '@wizardcoder/bl-reporter';

@NgModule({
	imports: [
		CommonModule,
		DatabaseRoutingModule,
		NgbTabsetModule,
		FontAwesomeModule,
		ItemModule,
		BranchModule,
    BlCommonModule,
    ReportDownloadModule
	],
	providers: [
    DatabaseExcelService
	],
  declarations: [
    DatabaseComponent, 
    DatabaseItemsComponent, 
    DatabaseBranchesComponent, 
    DatabaseReportsComponent, 
    DatabaseReportOrderComponent
  ]
})
export class DatabaseModule {
}
