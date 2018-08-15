import {Directive, HostListener} from '@angular/core';
import {BlcScannerService} from './blc-scanner.service';

@Directive({
	selector: '[blcScanner]'
})
export class BlcScannerDirective {

	scannerString: string;

	constructor(private _blcScannerService: BlcScannerService) {
		this.scannerString = '';
	}

	@HostListener('window:keydown', ['$event'])
	handleKeyDown(event: KeyboardEvent) {

		if (event.keyCode === 13) { // the key is enter
			this._blcScannerService.scanIsbn(this.scannerString);
			this.scannerString = '';
		} else {
			if (event.key && event.key !== 'undefined') {
				this.scannerString += event.key;
			}
		}

		if (this.scannerString.length > 20) {
			this.scannerString = '';
		}
	}
}
