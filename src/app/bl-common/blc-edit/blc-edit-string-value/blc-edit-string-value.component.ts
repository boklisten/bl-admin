import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
	selector: "app-blc-edit-string-value",
	templateUrl: "./blc-edit-string-value.component.html",
	styleUrls: ["./blc-edit-string-value.component.scss"],
})
export class BlcEditStringValueComponent implements OnInit {
	@Input() value: string;
	@Input() disabled: boolean;
	@Output() valueChange: EventEmitter<string>;
	@Output() update: EventEmitter<string>;

	public editing: boolean;

	constructor() {
		this.valueChange = new EventEmitter<string>();
		this.update = new EventEmitter<string>();
	}

	ngOnInit() {}

	onUpdate(value) {
		this.value = value;
		this.valueChange.emit(this.value);
		this.update.emit(this.value);
		this.editing = false;
	}
}
