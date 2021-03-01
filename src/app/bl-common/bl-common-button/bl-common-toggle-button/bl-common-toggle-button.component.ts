import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
	selector: "app-bl-common-toggle-button",
	templateUrl: "./bl-common-toggle-button.component.html",
	styleUrls: ["./bl-common-toggle-button.component.scss"],
})
export class BlCommonToggleButtonComponent implements OnInit {
	@Input() value: boolean;
	@Input() name: string;
	@Output() valueChange: EventEmitter<boolean>;
	@Output() update: EventEmitter<boolean>;
	@Input() tooltip: string;

	constructor() {
		this.valueChange = new EventEmitter<boolean>();
		this.update = new EventEmitter<boolean>();
	}

	ngOnInit() {}

	onUpdate(value) {
		this.value = value;
		this.valueChange.emit(value);
		this.update.emit(value);
	}
}
