import { NgModule } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { MessengerRoutingModule } from "./messenger-routing.module";
import { MessengerComponent } from "./messenger.component";
import { MessengerReminderComponent } from "./messenger-reminder/messenger-reminder.component";
import {
	NgbTabsetModule,
	NgbProgressbarModule,
	NgbButtonsModule
} from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { MessengerReminderModalComponent } from "./messenger-reminder/messenger-reminder-modal/messenger-reminder-modal.component";
import { MessengerListComponent } from "./messenger-list/messenger-list.component";
import { MessengerSequencePickerComponent } from "./messenger-sequence-picker/messenger-sequence-picker.component";

@NgModule({
	imports: [
		CommonModule,
		MessengerRoutingModule,
		NgbTabsetModule,
		FontAwesomeModule,
		BlCommonModule,
		NgbProgressbarModule,
		FormsModule,
		NgbButtonsModule,
		ReactiveFormsModule
	],
	declarations: [
		MessengerComponent,
		MessengerReminderComponent,
		MessengerReminderModalComponent,
		MessengerListComponent,
		MessengerSequencePickerComponent
	],
	entryComponents: [MessengerReminderModalComponent]
})
export class MessengerModule {}
