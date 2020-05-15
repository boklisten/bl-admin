import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Booking } from "@wizardcoder/bl-model";
import { BookingService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-booking-display",
	templateUrl: "./booking-display.component.html",
	styleUrls: ["./booking-display.component.scss"]
})
export class BookingDisplayComponent implements OnInit {
	@Input() booking: Booking;
	@Output() removed: EventEmitter<Booking>;
	public wait: boolean;

	constructor(private bookingService: BookingService) {
		this.removed = new EventEmitter<Booking>();
	}

	ngOnInit() {}

	onRemove() {
		this.wait = true;
		this.bookingService
			.remove(this.booking.id)
			.then(() => {
				this.wait = false;
				this.removed.emit(this.booking);
			})
			.catch(() => {
				this.wait = false;
				console.log("could not remove");
			});
	}
}
