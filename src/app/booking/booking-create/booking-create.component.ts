import { Component, OnInit } from "@angular/core";
import { Booking } from "@wizardcoder/bl-model";
import { BookingService } from "@wizardcoder/bl-connect";
import { FormBuilder } from "@angular/forms";
import { BookingCreateService } from "./booking-create.service";
import { DateService } from "../../date/date.service";

@Component({
	selector: "app-booking-create",
	templateUrl: "./booking-create.component.html",
	styleUrls: ["./booking-create.component.scss"]
})
export class BookingCreateComponent implements OnInit {
	createBookingsForm: any;
	public fromHour: number;
	public toHour: number;
	public minuteStep: number;
	public bookings: Booking[];

	constructor(
		private bookingService: BookingService,
		private formBuilder: FormBuilder,
		private bookingCreateService: BookingCreateService,
		private dateService: DateService
	) {
		this.fromHour = 0;
		this.toHour = 0;
		this.minuteStep = 5;
		this.bookings = [];
	}

	ngOnInit() {
		this.createBookingsForm = this.formBuilder.group({
			date: new Date(),
			interval: 5,
			fromHour: {
				hour: 0,
				minute: 0
			},
			toHour: {
				hour: 0,
				minute: 0
			}
		});
	}

	public onSubmit(data) {
		this.bookingService
			.get({
				fresh: true,
				query: "?from=>" + this.dateService.dateOnApiFormat(data.date)
			})
			.then(bookings => {
				this.bookings = this.bookingCreateService.generateBookings(
					data.date,
					data.fromHour,
					data.toHour,
					data.interval,
					bookings
				);
			})
			.catch(e => {
				console.log("error", e);
			});
	}

	public async onPush() {
		for (let booking of this.bookings) {
			if (!booking.id) {
				try {
					await this.bookingService.add(booking);
				} catch (e) {
					console.log("could not add booking", e);
				}
			}
		}
	}
}
