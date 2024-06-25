import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportDownloadComponent } from "./report-download/report-download.component";
import { ReporterComponent } from "./reporter.component";
import { FormsModule } from "@angular/forms";
import { BlConnectModule } from "@boklisten/bl-connect";
import {
	FontAwesomeModule,
	FaIconLibrary,
} from "@fortawesome/angular-fontawesome";
import {
	faLocationArrow,
	faToggleOn,
	faToggleOff,
	faCircleNotch,
	faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { ReportDownloadModule } from "./report-download/report-download.module";
import { BlCommonModule } from "../../../bl-common/bl-common.module";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		BlCommonModule,
		BlConnectModule,
		FontAwesomeModule,
		ReportDownloadModule,
	],
	declarations: [ReportDownloadComponent, ReporterComponent],
	exports: [ReporterComponent],
})
export class ReporterModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(
			faLocationArrow,
			faToggleOn,
			faToggleOff,
			faCircleNotch,
			faFileExcel
		);
	}
}
