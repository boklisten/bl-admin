import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { Component, Injectable } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "./auth/auth.service";
import { BranchStoreService } from "./branch/branch-store.service";
import { Observable } from "rxjs/internal/Observable";

@Component({ selector: "app-header", template: "" })
class HeaderStubComponent {}

@Component({ selector: "app-side-bar", template: "" })
class SideBarStubComponent {}

@Component({ selector: "router-outlet", template: "" })
class RouterOutletStubComponent {}

@Injectable()
class AuthStubService {
	onLogout() {
		return new Observable<any>();
	}

	onLogin() {
		return new Observable<any>();
	}

	onApplicationLogout() {
		return new Observable<any>();
	}

	isLoggedIn() {
		return true;
	}
}

@Injectable()
class BranchStoreStubService {}

@Injectable()
class RouterStubService {
	events: Observable<any>;

	constructor() {
		this.events = new Observable<any>();
	}
}

describe("AppComponent", () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AppComponent,
				HeaderStubComponent,
				SideBarStubComponent,
				RouterOutletStubComponent,
			],
			providers: [
				{ provide: AuthService, useClass: AuthStubService },
				{
					provide: BranchStoreService,
					useClass: BranchStoreStubService,
				},
				{ provide: Router, useClass: RouterStubService },
			],
		}).compileComponents();
	}));

	it("should create the app", async(() => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));
});
