import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class BlcEnterService {
	private _enter$: Subject<boolean>;

	constructor() {
		this._enter$ = new Subject();
	}

	public subscribe(func: (arrowUp: boolean) => void): Subscription {
		return this._enter$.asObservable().subscribe(func);
	}

	public set() {
		this._enter$.next(true);
	}
}
