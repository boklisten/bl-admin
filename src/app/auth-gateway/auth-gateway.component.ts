import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

@Component({
	selector: "app-auth-gateway",
	templateUrl: "./auth-gateway.component.html",
})
export class AuthGatewayComponent implements OnInit {
	constructor(private router: Router, private authService: AuthService) {}

	ngOnInit(): void {
		setTimeout(() => {
			this.router.navigate(["/"], { replaceUrl: true });
		}, 200);
	}
}
