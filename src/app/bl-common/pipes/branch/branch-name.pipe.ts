import {Pipe, PipeTransform} from '@angular/core';
import {BranchService} from "@wizardcoder/bl-connect";
import {Branch} from "@wizardcoder/bl-model";

@Pipe({
	name: 'branchName'
})
export class BranchNamePipe implements PipeTransform {
	
	constructor(private _branchService: BranchService) {
	
	}
	
	transform(branchId: string): Promise<string> {
		return this._branchService.getById(branchId).then((branch: Branch) => {
			return branch.name;
		}).catch(() => {
			return '<no branch found>';
		});
	}
	
}
