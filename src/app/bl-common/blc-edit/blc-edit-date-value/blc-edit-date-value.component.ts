import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import * as moment from "moment";

@Component({
	selector: "app-blc-edit-date-value",
	templateUrl: "./blc-edit-date-value.component.html",
	styleUrls: ["./blc-edit-date-value.component.scss"],
})
export class BlcEditDateValueComponent implements OnInit {
	@Input() value: Date;
	@Input() disabled: boolean;
	@Output() valueChange: EventEmitter<Date>;
	@Output() update: EventEmitter<Date>;

	public editing: boolean;

	constructor() {
		this.valueChange = new EventEmitter<Date>();
		this.update = new EventEmitter<Date>();
	}

	ngOnInit() {}

	onUpdate(value) {
		this.value = value;
		this.valueChange.emit(moment(this.value).toDate());
		this.update.emit(moment(this.value).toDate());
		this.editing = false;
	}
}
