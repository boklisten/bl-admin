import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-auth-gateway",
	templateUrl: "./auth-gateway.component.html",
})
export class AuthGatewayComponent implements OnInit {
	constructor(private router: Router) {}

	ngOnInit(): void {
		setTimeout(() => {
			this.router.navigate(["/"], { replaceUrl: true });
		}, 200);
	}
}
