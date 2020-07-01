import { Component, OnInit } from "@angular/core";
import { ToasterService } from "../toaster.service";

@Component({
	selector: "app-toaster",
	templateUrl: "./toaster.component.html",
	styleUrls: ["./toaster.component.scss"]
})
export class ToasterComponent implements OnInit {
	public toasts: any[];

	constructor(private _toasterService: ToasterService) {
		this.toasts = [];
	}

	ngOnInit() {
		this._toasterService.subscribe(toast => {
			this.toasts.push(toast);
			if (this.toasts.length > 10) {
				this.toasts.shift();
			}
			setTimeout(() => {
				this.toasts.shift();
			}, toast.ms);
		});
	}
}
