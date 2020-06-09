import { Directive, HostListener } from "@angular/core";
import { BlcArrowUpService } from "./blc-arrow-up.service";

@Directive({
	selector: "[blcArrowUpEvent]"
})
export class BlcArrowUpEventDirective {
	private ARROW_UP_KEY_CODE = 38;

	constructor(private _blcArrowDownService: BlcArrowUpService) {}

	@HostListener("window:keydown", ["$event"])
	handleKeyDown(event: KeyboardEvent) {
		if (event.keyCode === this.ARROW_UP_KEY_CODE) {
			this._blcArrowDownService.setArrowDown();
		}
	}
}
