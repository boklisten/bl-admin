import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
	selector: "app-blid-scanner-input",
	templateUrl: "./blid-scanner-input.component.html",
	styleUrls: ["./blid-scanner-input.component.scss"]
})
export class BlidScannerInputComponent implements OnInit {
	@Output() blid: EventEmitter<string>;
	public blidInput: string;

	constructor() {
		this.blid = new EventEmitter();
	}

	ngOnInit() {}

	public onBlidInput() {
		if (this.isBlidValid(this.blidInput)) {
			this.blid.emit(this.blidInput);
			this.blidInput = "";
		}
	}

	private isBlidValid(blid: string): boolean {
		if (blid.length !== 12) {
			return false;
		}
		return true;
	}
}
