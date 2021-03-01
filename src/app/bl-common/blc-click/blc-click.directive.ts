import { Directive, HostListener } from "@angular/core";
import { BlcClickService } from "./blc-click.service";

@Directive({
	selector: "[blcClickEvent]",
})
export class BlcClickDirective {
	constructor(private blcClickService: BlcClickService) {}

	@HostListener("document:click", ["$event"])
	documentClick(event: any): void {
		this.blcClickService.click(event.target);
	}
}
