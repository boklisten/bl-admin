import { Component, OnInit } from "@angular/core";
import { Booking, BlApiNotFoundError } from "@boklisten/bl-model";
import { BookingService } from "@boklisten/bl-connect";
import { FormBuilder } from "@angular/forms";
import { BookingCreateService } from "./booking-create.service";
import { DateService } from "../../date/date.service";
import { BranchStoreService } from "../../branch/branch-store.service";
import * as moment from "moment";

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
	public branchId: string;

	constructor(
		private bookingService: BookingService,
		private formBuilder: FormBuilder,
		private bookingCreateService: BookingCreateService,
		private dateService: DateService,
		private branchStoreService: BranchStoreService
	) {
		this.fromHour = 0;
		this.toHour = 0;
		this.minuteStep = 5;
		this.bookings = [];
		this.branchId = this.branchStoreService.getBranchId();
		this.branchStoreService.onBranchChange().subscribe(() => {
			this.branchId = this.branchStoreService.getBranchId();
		});
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

	public async onSubmit(data) {
		let alreadyAddedBookings = [];

		let fromDate = moment(data.date)
			.set("hour", data.fromHour.hour)
			.set("minute", data.fromHour.minute)
			.subtract(2, "hours")
			.toDate();

		let toDate = moment(data.date)
			.set("hour", data.toHour.hour)
			.set("minute", data.toHour.minute)
			.toDate();

		try {
			alreadyAddedBookings = await this.bookingService.get({
				fresh: true,
				query:
					"?from=>" +
					this.dateService.dateOnApiFormat(fromDate) +
					"&from=<" +
					this.dateService.dateOnApiFormat(toDate) +
					"&branch=" +
					this.branchId
			});
		} catch (e) {}

		this.bookings = this.bookingCreateService.generateBookings(
			data.date,
			data.fromHour,
			data.toHour,
			data.interval,
			alreadyAddedBookings
		);
	}

	public async onPush() {
		let newBookings = [];
		for (let booking of this.bookings) {
			if (!booking.id) {
				try {
					const addedBooking = await this.bookingService.add(booking);
					newBookings.push(addedBooking);
				} catch (e) {
					console.log("could not add booking", e);
				}
			} else {
				newBookings.push(booking);
			}
		}
		this.bookings = newBookings;
	}
}
