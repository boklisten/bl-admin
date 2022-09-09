import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";

@Component({
	selector: "app-blid-scanner-input",
	templateUrl: "./blid-scanner-input.component.html",
	styleUrls: ["./blid-scanner-input.component.scss"],
})
export class BlidScannerInputComponent implements OnInit {
	@Output() blid: EventEmitter<string>;
	public blidInput: string;

	constructor(private _blcScannerService: BlcScannerService) {
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
		return blid.length === 12 || this._blcScannerService.isUllernBlid(blid);
	}
}
