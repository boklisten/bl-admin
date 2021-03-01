import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Subject } from "rxjs/internal/Subject";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
	providedIn: "root",
})
export class BlcKeyeventDoubleShiftService {
	private _doubleShift$: Subject<boolean>;

	constructor(private _modalService: NgbModal) {
		this._doubleShift$ = new Subject<boolean>();
	}

	public onDoubleShift(): Observable<boolean> {
		return this._doubleShift$.asObservable();
	}

	public setDoubleShift() {
		if (!this._modalService.hasOpenModals()) {
			this._doubleShift$.next(true);
		}
	}
}
