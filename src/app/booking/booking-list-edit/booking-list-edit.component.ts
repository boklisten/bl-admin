import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Booking } from "@boklisten/bl-model";
import { BookingService } from "@boklisten/bl-connect";
import { BranchStoreService } from "../../branch/branch-store.service";
import * as moment from "moment";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { CustomerService } from "../../customer/customer.service";

@Component({
	selector: "app-booking-list-edit",
	templateUrl: "./booking-list-edit.component.html",
	styleUrls: ["./booking-list-edit.component.scss"],
})
export class BookingListEditComponent implements OnInit {
	@Input() customerId: string;
	bookings: Booking[];
	selectedList: any;
	selectedAll: boolean;
	branchId: string;
	activeBooking: Booking;
	wait: boolean;
	public numberOfBooked: number;

	constructor(
		private _route: ActivatedRoute,
		private bookingService: BookingService,
		private branchStoreService: BranchStoreService,
		private customerService: CustomerService
	) {
		this.selectedList = {};
		this.bookings = [];
		this.numberOfBooked = 0;
		this.customerId = this.customerService.getCustomerDetailId();
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

		let query = this.customerId
			? "?customer=" + this.customerId
			: "?branch=" + this.branchId;
		this.bookings = [];
		this.numberOfBooked = 0;

		this.bookingService
			.get({ query: query, fresh: true })
			.then((bookings) => {
				bookings.sort(
					(a, b) => moment(a.from).unix() - moment(b.from).unix()
				);
				this.bookings = bookings;
				this.numberOfBooked = this.countNumberOfBooked(this.bookings);
				this.wait = false;
			})
			.catch(() => {
				this.wait = false;
			});
	}

	private countNumberOfBooked(bookings: Booking[]): number {
		let num = 0;
		for (let booking of bookings) {
			if (booking.booked) num++;
		}
		return num;
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
