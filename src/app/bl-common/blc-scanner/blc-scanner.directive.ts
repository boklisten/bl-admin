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

		const target = event.target as HTMLElement;
		if (event.key === "Enter" && target.tagName !== "INPUT") {
			this.processScannerString();
			this.scannerString = "";
		} else if (event.key.length === 1) {
			this.scannerString += event.key;
		}
	}

	@HostListener("window:paste", ["$event"])
	handlePaste(event: ClipboardEvent) {
		const pastedData = event.clipboardData?.getData("text");
		const target = event.target as HTMLElement;
		if (pastedData && target.tagName !== "INPUT") {
			this.scannerString = pastedData.trim();
			this.processScannerString();
			this.scannerString = "";
		}
	}

	private processScannerString() {
		if (this.isNumeric(this.scannerString)) {
			if (this.scannerString.length === 8) {
				return this._blcScannerService.scanBlid(this.scannerString);
			}
			if (
				this.scannerString.length < 10 ||
				this.scannerString.length > 13
			) {
				return this._toasterService.add(
					"WARNING",
					{
						text: `"${this.scannerString}" er ikke en gyldig blid eller isbn.`,
					},
					5000
				);
			}
			return this._blcScannerService.scanIsbn(this.scannerString);
		}
		this._blcScannerService.scanBlid(this.scannerString.slice(-12));
	}

	private isNumeric(value) {
		return /^-?\d+$/.test(value);
	}
}
