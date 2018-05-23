import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DatabaseRoutingModule} from './database-routing.module';
import {DatabaseComponent} from './database/database.component';
import {DatabaseItemsComponent} from './database-items/database-items.component';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ItemModule} from '../item/item.module';
import {DatabaseExcelService} from './database-excel/database-excel.service';

@NgModule({
	imports: [
		CommonModule,
		DatabaseRoutingModule,
		NgbTabsetModule,
		FontAwesomeModule,
		ItemModule
	],
	providers: [
		DatabaseExcelService
	],
	declarations: [DatabaseComponent, DatabaseItemsComponent]
})
export class DatabaseModule {
}
