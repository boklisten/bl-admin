import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NgbTabset, NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-database',
	templateUrl: './database.component.html',
	styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit, AfterViewInit {
	public tab: string;

	@ViewChild('tabset') tabset;

	constructor(private _route: ActivatedRoute, private _tabConfig: NgbTabsetConfig) {
	}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this.tab = params['tab'];

			if (this.tab) {
				setTimeout(() => {
					this.tabset.select(this.tab);
				}, 10);
			}
		});
	}

	ngAfterViewInit() {

	}

}
