import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ScannerComponent } from "./scanner.component";

const routes: Routes = [{ path: "scanner", component: ScannerComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ScannerRoutingModule {}
