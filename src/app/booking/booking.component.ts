import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-booking",
	templateUrl: "./booking.component.html",
	styleUrls: ["./booking.component.scss"]
})
export class BookingComponent implements OnInit {
	isAdmin: boolean;
	activeTab: string;

	constructor(
		private authService: AuthService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit() {
		this.isAdmin = this.authService.isAdmin();
		this.activeTab = this.activatedRoute.firstChild.snapshot.url[0].path;
		this.router.events.subscribe(() => {
			this.activeTab = this.activatedRoute.firstChild.snapshot.url[0].path;
		});
	}
}
