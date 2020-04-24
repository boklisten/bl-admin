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
		interval: number,
		alreadyAddedBookings: Booking[]
	): Booking[] {
		let branchId = this.branchStoreService.getBranchId();
		let bookings: Booking[] = alreadyAddedBookings
			? alreadyAddedBookings
			: [];
		let currentDate = moment(date)
			.set("hour", fromTime.hour)
			.set("minute", fromTime.minute);

		let end = moment(currentDate)
			.set("hour", toTime.hour)
			.set("minute", toTime.minute);

		while (moment(currentDate).isBefore(end)) {
			let fromDate = currentDate.toDate();
			let alreadyAdded: boolean;

			for (let booking of alreadyAddedBookings) {
				if (
					moment(fromDate.toISOString()).isSame(
						booking.from.toString()
					) ||
					moment(fromDate.toISOString()).isBetween(
						booking.from.toString(),
						booking.to.toString(),
						"minutes"
					)
				) {
					alreadyAdded = true;
					currentDate.add(interval, "minutes");
					break;
				}
			}

			if (!alreadyAdded) {
				bookings.push({
					from: fromDate,
					to: currentDate.add(interval, "minutes").toDate(),
					customer: null,
					branch: branchId
				} as Booking);
			}
			alreadyAdded = false;
		}

		return bookings;
	}
}
