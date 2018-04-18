import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-side-bar-button',
	templateUrl: './side-bar-button.component.html',
	styleUrls: ['./side-bar-button.component.scss']
})
export class SideBarButtonComponent implements OnInit {
	@Input() icon: string[];
	@Input() icon2: string[];
	@Input() title: string;
	@Input() link: string;

	constructor() {
	}

	ngOnInit() {
	}

}
