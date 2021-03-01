import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class BlcClickService {
	private clickEvent$: Subject<HTMLElement>;

	constructor() {
		this.clickEvent$ = new Subject();
	}

	public click(element: HTMLElement) {
		this.clickEvent$.next(element);
	}

	public onClick(func: (element: HTMLElement) => void): Subscription {
		return this.clickEvent$.asObservable().subscribe(func);
	}
}
