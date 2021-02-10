import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Booking } from "@boklisten/bl-model";
import { BookingService } from "@boklisten/bl-connect";
import { AuthService } from "../../auth/auth.service";

@Component({
	selector: "app-booking-display",
	templateUrl: "./booking-display.component.html",
	styleUrls: ["./booking-display.component.scss"]
})
export class BookingDisplayComponent implements OnInit {
	@Input() booking: Booking;
	@Output() canceled: EventEmitter<Booking>;
	public wait: boolean;
	public isAdmin: boolean;

	constructor(
		private bookingService: BookingService,
		private authService: AuthService
	) {
		this.canceled = new EventEmitter<Booking>();
	}

	ngOnInit() {
		this.isAdmin = this.authService.isAdmin();
	}

	onCancel() {
		this.wait = true;
		this.bookingService
			.update(this.booking.id, { customer: null, booked: false })
			.then(() => {
				this.wait = false;
				this.canceled.emit(this.booking);
			})
			.catch(e => {
				this.wait = false;
				console.log("could not cancel", e);
			});
	}
}
