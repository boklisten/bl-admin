import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class BlcSortService {
	constructor() {}

	public sortByName(list: any[]): any[] {
		return list.sort((a: any, b: any) => {
			if (a && a.name && b && b.name) {
				const nameA = a.name.toLowerCase();
				const nameB = b.name.toLowerCase();
				if (nameA < nameB) {
					return -1;
				} else if (nameA > nameB) {
					return 1;
				}
			}
			return 0;
		});
	}
}
