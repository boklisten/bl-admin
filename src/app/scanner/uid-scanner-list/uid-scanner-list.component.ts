import {
	Component,
	OnInit,
	OnChanges,
	Output,
	EventEmitter,
	Input,
	SimpleChanges
} from "@angular/core";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";

@Component({
	selector: "app-uid-scanner-list",
	templateUrl: "./uid-scanner-list.component.html",
	styleUrls: ["./uid-scanner-list.component.scss"]
})
export class UidScannerListComponent implements OnInit, OnChanges {
	@Output() listChange: EventEmitter<string[]>;
	@Input() list: string[];

	public blids: string[];
	public alreadyScanned: string;

	constructor(private _blcScannerService: BlcScannerService) {
		this.blids = [];
		this.listChange = new EventEmitter();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["list"].currentValue) {
			this.blids = changes["list"].currentValue;
		}
	}

	ngOnInit() {
		this._blcScannerService.onBlid(blid => {
			if (this.blids.indexOf(blid) < 0) {
				this.blids.push(blid);
				this.setBlids(this.blids);
			} else {
				this.alreadyScanned = blid;

				setTimeout(() => {
					this.alreadyScanned = null;
				}, 500);
			}
		});
	}

	public onRemoveBlid(index: number) {
		this.blids.splice(index, 1);
		this.setBlids(this.blids);
	}

	private setBlids(blids: string[]) {
		this.listChange.emit(blids);
	}
}
