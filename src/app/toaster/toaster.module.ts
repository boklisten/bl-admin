import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastComponent } from "./toast/toast.component";
import { ToasterComponent } from "./toaster/toaster.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
	declarations: [ToastComponent, ToasterComponent],
	imports: [CommonModule, FontAwesomeModule],
	exports: [ToasterComponent]
})
export class ToasterModule {}
