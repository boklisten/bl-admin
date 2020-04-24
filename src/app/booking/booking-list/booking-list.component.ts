import { Component, OnInit, Input } from "@angular/core";
import { Booking } from "@wizardcoder/bl-model";

@Component({
	selector: "app-booking-list",
	templateUrl: "./booking-list.component.html",
	styleUrls: ["./booking-list.component.scss"]
})
export class BookingListComponent implements OnInit {
	@Input() bookings: Booking[];
	public selectedList = {};
	private selectedAll: boolean;

	constructor() {}

	ngOnInit() {}

	onSelectAll() {
		for (let booking of this.bookings) {
			this.selectedList[booking.from.toString()] = !this.selectedAll;
		}
		this.selectedAll = !this.selectedAll;
	}

	select(id) {
		this.selectedList[id] = this.selectedList[id] ? false : true;
		if (!this.selectedList[id]) {
			this.selectedAll = false;
		}
	}

	public removeSelected() {
		for (let key in this.selectedList) {
			for (let i = 0; i < this.bookings.length; i++) {
				if (this.bookings[i].from.toString() === key) {
					this.bookings.splice(i, 1);
					break;
				}
			}
			this.selectedList[key] = null;
		}
	}
}
