import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Booking } from "@wizardcoder/bl-model";
import { BranchStoreService } from "../../branch/branch-store.service";

type Time = {
	hour: number;
	minute: number;
};

@Injectable({
	providedIn: "root"
})
export class BookingCreateService {
	constructor(private branchStoreService: BranchStoreService) {}

	public generateBookings(
		date: Date,
		fromTime: Time,
		toTime: Time,
		interval: number
	): Booking[] {
		let branchId = this.branchStoreService.getBranchId();
		let bookings: Booking[] = [];
		let currentDate = moment(date)
			.set("hour", fromTime.hour)
			.set("minute", fromTime.minute);

		let end = moment(currentDate)
			.set("hour", toTime.hour)
			.set("minute", toTime.minute);

		while (moment(currentDate).isBefore(end)) {
			bookings.push({
				from: currentDate.toDate(),
				to: currentDate.add(interval, "minutes").toDate(),
				customer: null,
				branch: branchId
			} as Booking);
		}

		return bookings;
	}
}
