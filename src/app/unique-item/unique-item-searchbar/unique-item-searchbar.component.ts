import {
	Component,
	OnInit,
	Input,
	OnDestroy,
	Output,
	EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-unique-item-searchbar",
	templateUrl: "./unique-item-searchbar.component.html",
	styleUrls: ["./unique-item-searchbar.component.scss"],
})
export class UniqueItemSearchbarComponent implements OnInit, OnDestroy {
	@Input() blid: string;
	@Output() onSearch: EventEmitter<string>;
	private blidScanner: Subscription;

	constructor(
		private _router: Router,
		private _blcScannerService: BlcScannerService
	) {
		this.onSearch = new EventEmitter();
	}

	ngOnInit() {
		this.blid = "";
		this.handleBlcScannerChange();
	}

	ngOnDestroy() {
		this.blidScanner.unsubscribe();
	}

	private handleBlcScannerChange() {
		this.blidScanner = this._blcScannerService.onBlid((blid) => {
			this.blid = blid;
			this.onBlidSearch(this.blid);
		});
	}

	public onBlidSearch(blid: string) {
		this.onSearch.emit(blid);
	}
}
