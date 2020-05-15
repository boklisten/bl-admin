import { Component, OnInit } from "@angular/core";
import { Booking } from "@wizardcoder/bl-model";
import { BookingService } from "@wizardcoder/bl-connect";
import { BranchStoreService } from "../../branch/branch-store.service";
import * as moment from "moment";

@Component({
	selector: "app-booking-list-edit",
	templateUrl: "./booking-list-edit.component.html",
	styleUrls: ["./booking-list-edit.component.scss"]
})
export class BookingListEditComponent implements OnInit {
	bookings: Booking[];
	selectedList: any;
	selectedAll: boolean;
	branchId: string;
	activeBooking: Booking;
	wait: boolean;

	constructor(
		private bookingService: BookingService,
		private branchStoreService: BranchStoreService
	) {
		this.selectedList = {};
		this.bookings = [];
	}

	ngOnInit() {
		this.branchId = this.branchStoreService.getBranchId();
		this.getBookings();

		this.branchStoreService.onBranchChange().subscribe(() => {
			this.branchId = this.branchStoreService.getBranchId();
			this.selectedList = {};
			this.getBookings();
		});
	}

	private getBookings() {
		this.wait = true;
		let query = "?branch=" + this.branchId;
		this.bookings = [];

		this.bookingService
			.get({ query: query, fresh: true })
			.then(bookings => {
				bookings.sort(
					(a, b) => moment(a.from).unix() - moment(b.from).unix()
				);
				this.bookings = bookings;
				this.wait = false;
			})
			.catch(() => {
				this.wait = false;
			});
	}

	onSelectAll() {
		for (let booking of this.bookings) {
			this.selectedList[booking.from.toString()] = !this.selectedAll;
		}
		this.selectedAll = !this.selectedAll;
	}

	setActive(booking: Booking) {
		this.activeBooking = booking;
	}

	select(id) {
		this.selectedList[id] = this.selectedList[id] ? false : true;
		if (!this.selectedList[id]) {
			this.selectedAll = false;
		}
	}

	onCancel(booking: Booking) {
		this.setActive(null);
		this.selectedList = {};
		this.getBookings();
	}

	public async removeSelected() {
		this.wait = true;
		for (let key in this.selectedList) {
			if (this.selectedList[key]) {
				for (let i = 0; i < this.bookings.length; i++) {
					if (this.bookings[i].from.toString() === key) {
						if (
							this.activeBooking &&
							this.bookings[i].id == this.activeBooking.id
						) {
							this.setActive(null);
						}
						await this.bookingService.remove(this.bookings[i].id);
						this.bookings.splice(i, 1);

						break;
					}
				}
				this.selectedList[key] = null;
			}
		}
		this.wait = false;
		this.selectedList = {};
		//this.getBookings();
	}
}
