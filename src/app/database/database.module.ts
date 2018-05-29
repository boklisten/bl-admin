import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DatabaseRoutingModule} from './database-routing.module';
import {DatabaseComponent} from './database/database.component';
import {DatabaseItemsComponent} from './database-items/database-items.component';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ItemModule} from '../item/item.module';
import {DatabaseExcelService} from './database-excel/database-excel.service';
import { DatabaseBranchesComponent } from './database-branches/database-branches.component';
import {BranchModule} from '../branch/branch.module';

@NgModule({
	imports: [
		CommonModule,
		DatabaseRoutingModule,
		NgbTabsetModule,
		FontAwesomeModule,
		ItemModule,
		BranchModule
	],
	providers: [
		DatabaseExcelService
	],
	declarations: [DatabaseComponent, DatabaseItemsComponent, DatabaseBranchesComponent]
})
export class DatabaseModule {
}
