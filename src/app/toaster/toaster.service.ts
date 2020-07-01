import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class ToasterService {
	private toasts$: Subject<any>;

	constructor() {
		this.toasts$ = new Subject();
	}

	public subscribe(func: (toast: any) => void): Subscription {
		return this.toasts$.subscribe(func);
	}

	public add(type: "BLID-SCAN" | "ISBN-SCAN", content: any, ms: number) {
		this.toasts$.next({ type: type, content: content, ms: ms });
	}
}
