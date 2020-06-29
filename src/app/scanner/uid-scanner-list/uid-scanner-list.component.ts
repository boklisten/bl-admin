import { Component, OnInit } from "@angular/core";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";

@Component({
	selector: "app-uid-scanner-list",
	templateUrl: "./uid-scanner-list.component.html",
	styleUrls: ["./uid-scanner-list.component.scss"]
})
export class UidScannerListComponent implements OnInit {
	public blids: string[];
	public alreadyScanned: string;

	constructor(private _blcScannerService: BlcScannerService) {
		this.blids = [];
	}

	ngOnInit() {
		this._blcScannerService.onBlid(blid => {
			if (this.blids.indexOf(blid) < 0) {
				this.blids.push(blid);
			} else {
				this.alreadyScanned = blid;

				setTimeout(() => {
					this.alreadyScanned = null;
				}, 1500);
			}
		});
	}

	public onRemoveBlid(index: number) {
		this.blids.splice(index, 1);
	}
}
