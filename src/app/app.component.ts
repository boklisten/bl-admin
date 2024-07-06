import { Component } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { BranchStoreService } from "./branch/branch-store.service";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";
import { BlNextLinkerService } from "./bl-next-linker/bl-next-linker.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	title = "app";
	public showContent: boolean;
	public devEnvironment: boolean;

	constructor(
		private _authService: AuthService,
		private _branchStoreService: BranchStoreService,
		private _router: Router,
		private _blNextLinkerService: BlNextLinkerService
	) {
		this.showContent = false;
		this.devEnvironment = !environment.production;

		this._router.events.subscribe(() => {
			window.scroll(0, 0);
		});

		this._authService.onLogout().subscribe(() => {
			this.showContent = false;
		});

		this._authService.onLogin().subscribe(() => {
			this.showContent = true;
		});

		this._authService.onApplicationLogout().subscribe(() => {
			this.showContent = false;
		});

		this._blNextLinkerService.receiveTokens();

		this.showContent = this._authService.isLoggedIn();
	}
}
