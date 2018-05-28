import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-bl-common-toggle-button',
	templateUrl: './bl-common-toggle-button.component.html',
	styleUrls: ['./bl-common-toggle-button.component.scss']
})
export class BlCommonToggleButtonComponent implements OnInit {
	@Input() value: boolean;
	@Input() tooltip: string;

	constructor() {
	}

	ngOnInit() {
	}

}
