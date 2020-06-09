import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class BlcArrowDownService {
	private _arrowDown$: Subject<boolean>;

	constructor() {
		this._arrowDown$ = new Subject();
	}

	public subscribe(func: (arrowDown: boolean) => void): Subscription {
		return this._arrowDown$.asObservable().subscribe(func);
	}

	public setArrowDown() {
		this._arrowDown$.next(true);
	}
}
