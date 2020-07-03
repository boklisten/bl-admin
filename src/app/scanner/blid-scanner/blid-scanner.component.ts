import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	OnDestroy
} from "@angular/core";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-blid-scanner",
	templateUrl: "./blid-scanner.component.html",
	styleUrls: ["./blid-scanner.component.scss"]
})
export class BlidScannerComponent implements OnInit, OnDestroy {
	@Output() blid: EventEmitter<string>;
	public currentBlid: string;
	public showInput: boolean;
	private blidScan$: Subscription;

	constructor(private _blcScannerService: BlcScannerService) {
		this.blid = new EventEmitter();
	}

	ngOnInit() {
		this.handleBlidScanChange();
	}

	ngOnDestroy() {
		if (this.blidScan$) {
			this.blidScan$.unsubscribe();
		}
	}

	public onBlidInput(blid: string) {
		this.setBlid(blid);
	}

	public onShowInput() {
		this.showInput = !this.showInput;
	}

	public onCancelBlid() {
		this.setBlid(null);
	}

	private handleBlidScanChange() {
		this.blidScan$ = this._blcScannerService.onBlid(blid => {
			this.setBlid(blid);
		});
	}

	private setBlid(blid: string) {
		this.currentBlid = blid;
		this.blid.emit(blid);
	}
}
