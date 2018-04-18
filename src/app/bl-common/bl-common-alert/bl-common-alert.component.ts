import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-bl-common-alert',
	templateUrl: './bl-common-alert.component.html',
	styleUrls: ['./bl-common-alert.component.scss']
})
export class BlCommonAlertComponent implements OnInit {

	@Input() type: "warning" | "success" | "danger";
	@Input() text: string;
	@Input() desc: string;
	@Output() exit: EventEmitter<boolean>;

	public showAlert: boolean;

	constructor() {
		this.exit = new EventEmitter<boolean>();
		this.showAlert = true;
	}

	ngOnInit() {
		if (this.type) {
			switch (this.type) {
				case 'warning':
					this.showDanger();
					break;
				case 'success':
					this.showSuccess();
					break;
				case 'danger':
					this.showDanger();
			}
			this.showAlert = true;
		}
	}

	showWarning() {

	}

	showDanger() {

	}

	showSuccess() {
		setTimeout(() => {
			this.onExit();
		}, 2000);
	}

	onExit() {
		this.exit.emit(true);
	}

}
