import { Component, OnInit } from "@angular/core";
import { BookingService } from "@wizardcoder/bl-connect";
import { Booking } from "@wizardcoder/bl-model";
import * as moment from "moment";
import { DateService } from "../../date/date.service";
import { BranchStoreService } from "../../branch/branch-store.service";

@Component({
	selector: "app-booking-view",
	templateUrl: "./booking-view.component.html",
	styleUrls: ["./booking-view.component.scss"]
})
export class BookingViewComponent implements OnInit {
	public bookingDate: Date;
	public bookings: Booking[];
	public branchId: string;
	public wait: boolean;

	constructor(
		private bookingService: BookingService,
		private dateService: DateService,
		private branchStoreService: BranchStoreService
	) {
		this.bookings = [];
		this.wait = false;
	}

	ngOnInit() {
		this.branchId = this.branchStoreService.getBranchId();
		this.bookingDate = null;

		this.branchStoreService.onBranchChange().subscribe(() => {
			this.branchId = this.branchStoreService.getBranchId();
		});
	}

	public onBookingDateChange(date: Date) {
		this.bookingDate = date;
		this.getBookings(date);
	}

	private async getBookings(fromDate: Date) {
		let gtDate = moment(fromDate)
			.set("hour", 0)
			.set("minute", 0)
			.subtract(2, "hours")
			.toDate();

		let ltDate = moment(fromDate)
			.set("hour", 23)
			.set("minute", 59)
			.toDate();

		this.wait = true;

		try {
			this.bookings = await this.bookingService.get({
				fresh: true,
				query:
					"?from=>" +
					this.dateService.dateOnApiFormat(gtDate) +
					"&from=<" +
					this.dateService.dateOnApiFormat(ltDate) +
					"&branch=" +
					this.branchId
			});
		} catch (e) {
			this.bookings = [];
		}

		this.bookings.sort(
			(a, b) => moment(a.from).unix() - moment(b.from).unix()
		);

		this.wait = false;
	}
}
