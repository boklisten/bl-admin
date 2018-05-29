import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-blc-edit-number-value',
	templateUrl: './blc-edit-number-value.component.html',
	styleUrls: ['./blc-edit-number-value.component.scss']
})
export class BlcEditNumberValueComponent implements OnInit {

	@Input() value: number;
	@Input() disabled: boolean;
	@Output() valueChange: EventEmitter<number>;
	@Output() update: EventEmitter<number>;

	public editing: boolean;

	constructor() {
		this.valueChange = new EventEmitter<number>();
		this.update = new EventEmitter<number>();
	}

	ngOnInit() {
	}

	onUpdate(value) {
		this.value = value;
		this.valueChange.emit(this.value);
		this.update.emit(this.value);
		this.editing = false;
	}
}
