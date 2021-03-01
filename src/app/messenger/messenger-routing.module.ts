import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MessengerComponent } from "./messenger.component";
import { MessengerGenericComponent } from "./messenger-generic/messenger-generic.component";
import { MessengerListComponent } from "./messenger-list/messenger-list.component";
import { MessengerReminderComponent } from "./messenger-reminder/messenger-reminder.component";
import { MessengerMatchComponent } from "./messenger-match/messenger-match.component";

const routes: Routes = [
	{
		path: "messenger",
		component: MessengerComponent,

		children: [
			{ path: "", pathMatch: "full", redirectTo: "generic" },
			{ path: "generic", component: MessengerGenericComponent },
			{ path: "list", component: MessengerListComponent },
			{ path: "reminder", component: MessengerReminderComponent },
			{ path: "match", component: MessengerMatchComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MessengerRoutingModule {}
