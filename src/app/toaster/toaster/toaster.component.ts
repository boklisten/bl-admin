import { Component, OnInit } from "@angular/core";
import { ToasterService } from "../toaster.service";

@Component({
	selector: "app-toaster",
	templateUrl: "./toaster.component.html",
	styleUrls: ["./toaster.component.scss"],
})
export class ToasterComponent implements OnInit {
	public toasts: any[];

	constructor(private _toasterService: ToasterService) {
		this.toasts = [];
	}

	ngOnInit() {
		this._toasterService.subscribe((toast) => {
			if (toast.id) {
				toast.ms = 99999;
				let removed = this.removeToastIfAlreadyAdded(toast.id);
				if (removed) {
					return;
				}
			}

			this.toasts.push(toast);

			if (this.toasts.length > 10) {
				this.toasts.shift();
			}

			setTimeout(() => {
				this.toasts.shift();
			}, toast.ms);
		});
	}

	private removeToastIfAlreadyAdded(id: string): boolean {
		for (let i = 0; i < this.toasts.length; i++) {
			if (this.toasts[i].id === id) {
				this.toasts.splice(i, 1);
				return true;
			}
		}
		return false;
	}
}
