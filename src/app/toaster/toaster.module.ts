import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastComponent } from "./toast/toast.component";
import { ToasterComponent } from "./toaster/toaster.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [ToastComponent, ToasterComponent],
	imports: [CommonModule, FontAwesomeModule, RouterModule],
	exports: [ToasterComponent]
})
export class ToasterModule {}
