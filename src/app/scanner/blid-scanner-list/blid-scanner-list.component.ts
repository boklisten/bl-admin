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
	selector: "app-blid-scanner-list",
	templateUrl: "./blid-scanner-list.component.html",
	styleUrls: ["./blid-scanner-list.component.scss"]
})
export class BlidScannerListComponent implements OnInit, OnChanges {
	@Output() listChange: EventEmitter<string[]>;
	@Input() list: string[];
	@Input() clear: boolean;

	public blids: string[];
	public alreadyScanned: string;
	public alreadyAddedUniqueItems: { [blid: string]: boolean };
	public showManualInput: boolean;

	constructor(private _blcScannerService: BlcScannerService) {
		this.blids = [];
		this.listChange = new EventEmitter();
		this.alreadyAddedUniqueItems = {};
		this.showManualInput = false;
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["clear"].currentValue) {
			this.blids = [];
			this.alreadyAddedUniqueItems = {};
		}
	}

	ngOnInit() {
		this._blcScannerService.onBlid(blid => {
			this.addBlid(blid);
		});
	}

	private addBlid(blid: string) {
		if (this.blids.indexOf(blid) < 0) {
			this.blids.unshift(blid);
			this.setBlids(this.blids);
		} else {
			this.alreadyScanned = blid;

			setTimeout(() => {
				this.alreadyScanned = null;
			}, 500);
		}
	}

	public onManualBlidInput(blid: string) {
		this.addBlid(blid);
	}

	public onShowManualInput() {
		this.showManualInput = !this.showManualInput;
	}

	public onRemoveBlid(index: number) {
		this.blids.splice(index, 1);
		this.setBlids(this.blids);
	}

	public onAlreadyAddedBlid(index: number) {
		this.alreadyAddedUniqueItems[this.blids[index]] = true;
	}

	private setBlids(blids: string[]) {
		const validBlids = blids.filter(blid => {
			return !this.alreadyAddedUniqueItems[blid];
		});

		this.listChange.emit(validBlids);
	}
}
