import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-blc-datatable-string-cell',
	templateUrl: './blc-datatable-string-cell.component.html',
	styleUrls: ['./blc-datatable-string-cell.component.scss']
})
export class BlcDatatableStringCellComponent implements OnInit {
	@Input() rowIndex: any;
	@Input() name: string;
	@Input() value: string;
	@Output() valueChange: EventEmitter<string>;
	@Input() disabled: boolean;
	@Input() editingObj: any;
	@Output() update: EventEmitter<{rowIndex: number, name: string}>;

	constructor() {
		this.update = new EventEmitter();
		this.valueChange = new EventEmitter<string>();
	}

	ngOnInit() {
	}

	onUpdate(value) {
		this.value = value;
		this.valueChange.emit(this.value);
		this.update.emit({rowIndex: this.rowIndex, name: this.name});
	}

}
