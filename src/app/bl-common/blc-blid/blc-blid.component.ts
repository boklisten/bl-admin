import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-blc-blid",
	templateUrl: "./blc-blid.component.html",
	styleUrls: ["./blc-blid.component.scss"]
})
export class BlcBlidComponent implements OnInit {
	@Input() blid: string;
	@Input() size: "sm" | "md" | "lg" | "xl";

	constructor() {}

	ngOnInit() {
		if (!this.size) {
			this.size = "md";
		}
	}
}
