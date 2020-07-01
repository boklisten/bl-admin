import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-toast",
	templateUrl: "./toast.component.html",
	styleUrls: ["./toast.component.scss"]
})
export class ToastComponent implements OnInit {
	@Input() toast: any;

	constructor() {}

	ngOnInit() {}
}
