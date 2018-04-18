import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-bl-common-update-button',
	templateUrl: './bl-common-update-button.component.html',
	styleUrls: ['./bl-common-update-button.component.scss']
})
export class BlCommonUpdateButtonComponent implements OnInit {

	@Input() text: string;
	@Input() wait: boolean;
	@Input() icon: string;
	@Output() click: EventEmitter<boolean>;

	constructor() {
		this.click = new EventEmitter<boolean>();
	}


	ngOnInit() {
	}

	onClick() {
		if (!this.wait) {
			this.click.emit(true);
		}
}

}
