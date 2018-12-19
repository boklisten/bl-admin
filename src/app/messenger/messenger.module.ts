import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MessengerRoutingModule } from "./messenger-routing.module";
import { MessengerComponent } from "./messenger.component";
import { MessengerReminderComponent } from "./messenger-reminder/messenger-reminder.component";
import { NgbTabsetModule, NgbProgressbarModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { MessengerReminderModalComponent } from "./messenger-reminder/messenger-reminder-modal/messenger-reminder-modal.component";

@NgModule({
	imports: [
		CommonModule,
		MessengerRoutingModule,
		NgbTabsetModule,
		FontAwesomeModule,
    BlCommonModule,
    NgbProgressbarModule
	],
	declarations: [
		MessengerComponent,
		MessengerReminderComponent,
		MessengerReminderModalComponent
	],
	entryComponents: [MessengerReminderModalComponent]
})
export class MessengerModule {}
