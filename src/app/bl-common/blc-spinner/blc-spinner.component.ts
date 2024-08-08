import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "app-blc-spinner",
	templateUrl: "./blc-spinner.component.html",
})
export class BlcSpinnerComponent implements OnInit {
	@Input() loading: boolean;

	constructor() {}

	ngOnInit() {}
}
