import { Injectable } from "@angular/core";

@Injectable()
export class BranchItemCategorySelectService {
	private _categories: string[];

	constructor() {
		this._categories = [];
	}

	public add(name: string) {
		for (const category of this._categories) {
			if (category === name) {
				return;
			}
		}
		this._categories.push(name);
	}

	public getCategories(): string[] {
		return this._categories;
	}
}
