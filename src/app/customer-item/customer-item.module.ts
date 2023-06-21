import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomerItemRoutingModule } from "./customer-item-routing.module";
import { CustomerItemHandlerService } from "./customer-item-handler/customer-item-handler.service";
import { CustomerItemDetailComponent } from "./customer-item-detail/customer-item-detail.component";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CustomerItemListComponent } from "./customer-item-list/customer-item-list.component";
import { CustomerItemListItemComponent } from "./customer-item-list/customer-item-list-item/customer-item-list-item.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
	imports: [
		CommonModule,
		CustomerItemRoutingModule,
		BlCommonModule,
		FontAwesomeModule,
		ReactiveFormsModule,
		FormsModule,
	],
	declarations: [
		CustomerItemDetailComponent,
		CustomerItemListComponent,
		CustomerItemListItemComponent,
	],
	providers: [CustomerItemHandlerService],
	exports: [CustomerItemListComponent, CustomerItemDetailComponent],
})
export class CustomerItemModule {}
