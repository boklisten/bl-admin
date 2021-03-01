import { Directive, HostListener } from "@angular/core";
import { BlcEnterService } from "./blc-enter.service";

@Directive({
	selector: "[blcEnterEvent]",
})
export class BlcEnterEventDirective {
	private ENTER_KEY_CODE = 13;

	constructor(private _blcEnterService: BlcEnterService) {}

	@HostListener("window:keydown", ["$event"])
	handleKeyDown(event: KeyboardEvent) {
		if (event.keyCode === this.ENTER_KEY_CODE) {
			this._blcEnterService.set();
		}
	}
}
