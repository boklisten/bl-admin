import { Subscription, Subject } from "rxjs";

export class Subscribable {
	protected _change$: Subject<boolean>;

	constructor() {
		this._change$ = new Subject();
	}

	public subscribe(func: (change: boolean) => void): Subscription {
		return this._change$.asObservable().subscribe(func);
	}

	protected notify(): void {
		this._change$.next(true);
	}
}
