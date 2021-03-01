import { NgModule } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { MessengerRoutingModule } from "./messenger-routing.module";
import { MessengerComponent } from "./messenger.component";
import { MessengerReminderComponent } from "./messenger-reminder/messenger-reminder.component";
import {
	NgbProgressbarModule,
	NgbButtonsModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BlCommonModule } from "../bl-common/bl-common.module";
import { MessengerReminderModalComponent } from "./messenger-reminder/messenger-reminder-modal/messenger-reminder-modal.component";
import { MessengerListComponent } from "./messenger-list/messenger-list.component";
import { MessengerSequencePickerComponent } from "./messenger-sequence-picker/messenger-sequence-picker.component";
import { MessengerGenericComponent } from "./messenger-generic/messenger-generic.component";
import { MessengerSendModalComponent } from "./messenger-send-modal/messenger-send-modal.component";
import { MessengerMatchComponent } from "./messenger-match/messenger-match.component";

@NgModule({
	imports: [
		CommonModule,
		MessengerRoutingModule,
		FontAwesomeModule,
		BlCommonModule,
		NgbProgressbarModule,
		FormsModule,
		NgbButtonsModule,
		ReactiveFormsModule,
	],
	declarations: [
		MessengerComponent,
		MessengerReminderComponent,
		MessengerReminderModalComponent,
		MessengerListComponent,
		MessengerSequencePickerComponent,
		MessengerGenericComponent,
		MessengerSendModalComponent,
		MessengerMatchComponent,
	],
	exports: [MessengerListComponent],
	entryComponents: [
		MessengerReminderModalComponent,
		MessengerSendModalComponent,
	],
})
export class MessengerModule {}
