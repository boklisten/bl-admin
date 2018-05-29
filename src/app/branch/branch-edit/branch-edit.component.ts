import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {BranchService} from '@wizardcoder/bl-connect';
import {Branch} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-branch-edit',
	templateUrl: './branch-edit.component.html',
	styleUrls: ['./branch-edit.component.scss']
})
export class BranchEditComponent implements OnInit {
	private _currentId: string;
	public branch: Branch;

	constructor(private _branchService: BranchService, private _route: ActivatedRoute) {
	}


	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this._currentId = params['id'];

			if (this._currentId) {
				this.getBranch(this._currentId);
			}
		});
	}

	getBranch(id: string) {
		this._branchService.getById(id).then((branch: Branch) => {
			this.branch = branch;
		}).catch((getBranchError) => {
			console.log('branchInfoComponent: could not get branch', getBranchError);
		});
	}
}
