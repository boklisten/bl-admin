import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { Booking } from "@boklisten/bl-model";
import { BranchService } from "@boklisten/bl-connect";
import * as moment from "moment";

@Component({
	selector: "app-booking-time-picker",
	templateUrl: "./booking-time-picker.component.html",
	styleUrls: ["./booking-time-picker.component.scss"],
})
export class BookingTimePickerComponent implements OnInit {
	@Input() branchId: string;
	@Output() picked: EventEmitter<Date>;
	public bookingDates: any[];
	public pickedDate: Date;

	constructor(private branchService: BranchService) {
		this.picked = new EventEmitter<Date>();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["branchId"]) {
			this.getBookingDates();
		}
	}

	ngOnInit() {
		if (this.branchId) this.getBookingDates();
	}

	private getBookingDates() {
		this.pick(null);
		this.branchService
			.getWithOperation(this.branchId, "booking-dates")
			.then((bookingDates: any[]) => {
				bookingDates.sort(
					(a, b) => moment(a.from).unix() - moment(b.from).unix()
				);

				this.bookingDates = bookingDates;
				this.setDefault();
			})
			.catch((e) => {
				console.log("could not get bookingDates", e);
			});
	}

	public pick(date: Date) {
		this.pickedDate = date;
		this.picked.emit(date);
	}

	public onDateChange() {
		this.pick(null);
	}

	private setDefault() {
		for (let bookingDate of this.bookingDates) {
			if (moment().isSame(bookingDate.from, "day")) {
				this.pick(bookingDate.from);
				return;
			}
		}
	}
}
