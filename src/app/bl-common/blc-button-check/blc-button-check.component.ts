import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: "app-blc-button-check",
	templateUrl: "./blc-button-check.component.html",
	styleUrls: ["./blc-button-check.component.scss"]
})
export class BlcButtonCheckComponent implements OnInit {
	@Input() value: boolean;
	@Output() valueChange: EventEmitter<boolean>;

	constructor() {
		this.valueChange = new EventEmitter<boolean>();
	}

	ngOnInit() {
		if (this.value === undefined) {
			this.value = false;
		}
	}

	onClick() {
		this.valueChange.emit(!this.value);
	}
}
