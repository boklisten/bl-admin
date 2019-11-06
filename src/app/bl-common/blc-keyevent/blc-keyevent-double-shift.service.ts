import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Subject } from "rxjs/internal/Subject";

@Injectable({
	providedIn: "root"
})
export class BlcKeyeventDoubleShiftService {
	private _doubleShift$: Subject<boolean>;

	constructor() {
		this._doubleShift$ = new Subject<boolean>();
	}

	public onDoubleShift(): Observable<boolean> {
		return this._doubleShift$.asObservable();
	}

	public setDoubleShift() {
		this._doubleShift$.next(true);
	}
}
