import { Directive, HostListener } from "@angular/core";
import { BlcScannerService } from "./blc-scanner.service";

@Directive({
	selector: "[blcScanner]"
})
export class BlcScannerDirective {
	scannerString: string;

	constructor(private _blcScannerService: BlcScannerService) {
		this.scannerString = "";
	}

	@HostListener("window:keydown", ["$event"])
	handleKeyDown(event: KeyboardEvent) {
		if (event.keyCode === 13) {
			// enter
			if (this.scannerString.length === 12) {
				this._blcScannerService.scanBlid(this.scannerString);
			}
			if (this.scannerString.length === 13) {
				this._blcScannerService.scanIsbn(this.scannerString);
			}
			this.scannerString = "";
		} else {
			if (this.isAlphaNumeric(event.key)) {
				this.scannerString += event.key;
			}
		}

		if (this.scannerString.length > 13) {
			this.scannerString = "";
		}
	}

	private isAlphaNumeric(key: string) {
		if (!key || key === "Shift") {
			return false;
		}
		return true;
	}
}
