import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class BlcArrowUpService {
	private _arrowUp$: Subject<boolean>;

	constructor() {
		this._arrowUp$ = new Subject();
	}

	public subscribe(func: (arrowUp: boolean) => void): Subscription {
		return this._arrowUp$.asObservable().subscribe(func);
	}

	public setArrowDown() {
		this._arrowUp$.next(true);
	}
}
