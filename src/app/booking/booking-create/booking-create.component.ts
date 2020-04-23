import { Component, OnInit } from "@angular/core";
import { Booking } from "@wizardcoder/bl-model";
import { BookingService } from "@wizardcoder/bl-connect";
import { FormBuilder } from "@angular/forms";

@Component({
	selector: "app-booking-create",
	templateUrl: "./booking-create.component.html",
	styleUrls: ["./booking-create.component.scss"]
})
export class BookingCreateComponent implements OnInit {
	createBookingsForm: any;

	constructor(
		private bookingService: BookingService,
		private formBuilder: FormBuilder
	) {}

	ngOnInit() {
		this.createBookingsForm = this.formBuilder.group({
			from: new Date(),
			to: new Date(),
			interval: 5
		});
	}

	public onSubmit(data) {
		console.log(data);
	}
}
