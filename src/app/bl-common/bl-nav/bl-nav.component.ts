import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-bl-nav",
	templateUrl: "./bl-nav.component.html",
	styleUrls: ["./bl-nav.component.scss"],
})
export class BlNavComponent implements OnInit {
	@Input() navNames: string[];

	constructor() {}

	ngOnInit(): void {}
}
