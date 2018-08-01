import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-blc-edit-date-value',
	templateUrl: './blc-edit-date-value.component.html',
	styleUrls: ['./blc-edit-date-value.component.scss']
})
export class BlcEditDateValueComponent implements OnInit {
	@Input() value: Date;
	@Output() valueChange: EventEmitter<Date>;
	@Output() update: EventEmitter<Date>;

	public editing: boolean;

	constructor() {
		this.valueChange = new EventEmitter<Date>();
		this.update = new EventEmitter<Date>();
	}

	ngOnInit() {
	}

	onUpdate(value) {
		console.log('the value', value);
		this.value = value;
		this.valueChange.emit(this.value);
		this.update.emit(this.value);
		this.editing = false;
	}

}
