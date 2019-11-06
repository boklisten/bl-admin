import { Directive, HostListener } from "@angular/core";
import { BlcKeyeventDoubleShiftService } from "./blc-keyevent-double-shift.service";

@Directive({
	selector: "[blcKeyeventDoubleShift]"
})
export class BlcKeyeventDoubleShiftDirective {
	private shiftCount: number;

	constructor(
		private _blcKeyeventDoubleShiftService: BlcKeyeventDoubleShiftService
	) {
		this.shiftCount = 0;
	}

	@HostListener("window:keydown", ["$event"])
	handleKeyDown(event: KeyboardEvent) {
		if (event.keyCode === 16) {
			// the key is enter
			this.shiftCount += 1;

			if (this.shiftCount === 2) {
				this._blcKeyeventDoubleShiftService.setDoubleShift();
				this.shiftCount = 0;
			}
		} else {
			this.shiftCount = 0;
		}
	}
}
