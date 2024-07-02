import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExcelService } from "../excel/excel.service";
import { PaymentDownloadService } from "./payment-download/payment-download.service";
import { PaymentDownloadComponent } from "./payment-download/payment-download.component";
import { OrderDownloadService } from "./order-download/order-download.service";
import { OrderDownloadComponent } from "./order-download/order-download.component";
import { CustomerItemDownloadComponent } from "./customer-item-download/customer-item-download.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserDetailDownloadComponent } from "./user-detail-download/user-detail-download.component";
import { UserDetailDownloadService } from "./user-detail-download/user-detail-download.service";
import { DateService } from "../../../../date/date.service";
import { BlCommonModule } from "../../../../bl-common/bl-common.module";

@NgModule({
	imports: [CommonModule, BlCommonModule, FontAwesomeModule],
	providers: [
		ExcelService,
		PaymentDownloadService,
		OrderDownloadService,
		UserDetailDownloadService,
		DateService,
	],
	declarations: [
		PaymentDownloadComponent,
		OrderDownloadComponent,
		CustomerItemDownloadComponent,
		UserDetailDownloadComponent,
	],
	exports: [
		PaymentDownloadComponent,
		OrderDownloadComponent,
		CustomerItemDownloadComponent,
		UserDetailDownloadComponent,
	],
})
export class ReportDownloadModule {}
