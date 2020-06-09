import { Directive, HostListener } from "@angular/core";
import { BlcArrowDownService } from "./blc-arrow-down.service";

@Directive({
	selector: "[blcArrowDownEvent]"
})
export class BlcArrowDownEventDirective {
	private ARROW_DOWN_KEY_CODE = 40;

	constructor(private _blcArrowDownService: BlcArrowDownService) {}

	@HostListener("window:keydown", ["$event"])
	handleKeyDown(event: KeyboardEvent) {
		if (event.keyCode === this.ARROW_DOWN_KEY_CODE) {
			this._blcArrowDownService.setArrowDown();
		}
	}
}
