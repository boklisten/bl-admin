import { Directive, HostListener } from "@angular/core";
import { BlcScannerService } from "./blc-scanner.service";
import { ToasterService } from "../../toaster/toaster.service";

@Directive({
	selector: "[blcScanner]",
})
export class BlcScannerDirective {
	scannerString: string;
	capsLock: boolean;

	constructor(
		private _blcScannerService: BlcScannerService,
		private _toasterService: ToasterService
	) {
		this.scannerString = "";
	}

	private checkCapsLock(event: KeyboardEvent) {
		this.capsLock =
			event.getModifierState && event.getModifierState("CapsLock");
	}

	@HostListener("window:keyup", ["$event"])
	handleKeyUp(event: KeyboardEvent) {
		this.checkCapsLock(event);
	}

	@HostListener("window:keydown", ["$event"])
	handleKeyDown(event: KeyboardEvent) {
		this.checkCapsLock(event);
		if (this.capsLock) {
			this._toasterService.add(
				"WARNING",
				{
					text: "CAPS LOCK er på.",
				},
				5000
			);
			return;
		}

		if (event.key === "Enter") {
			this.processScannerString();
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

	@HostListener("window:paste", ["$event"])
	handlePaste(event: ClipboardEvent) {
		const pastedData = event.clipboardData?.getData("text");
		if (pastedData) {
			this.scannerString = pastedData.trim();
			this.processScannerString();
			this.scannerString = "";
		}
	}

	private processScannerString() {
		if (
			this.scannerString.length === 12 ||
			this._blcScannerService.isUllernBlid(this.scannerString)
		) {
			this._blcScannerService.scanBlid(this.scannerString);
		} else if (
			this.scannerString.length > 9 &&
			this.scannerString.length < 14
		) {
			this._blcScannerService.scanIsbn(this.scannerString);
		} else {
			this._toasterService.add(
				"WARNING",
				{
					text: `"${this.scannerString}" er ikke en gyldig blid eller isbn.`,
				},
				5000
			);
		}
	}

	private isAlphaNumeric(key: string) {
		return !(!key || key === "Shift");
	}
}
