import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CustomerItemType } from "@wizardcoder/bl-model";

type SelectableType = CustomerItemType | "all";
@Component({
	selector: "app-blc-type-select",
	templateUrl: "./blc-type-select.component.html",
	styleUrls: ["./blc-type-select.component.scss"]
})
export class BlcTypeSelectComponent implements OnInit {
	@Output() selectedType: EventEmitter<SelectableType>;
	typeOptions: SelectableType[];
	currentType: SelectableType;

	constructor() {
		this.selectedType = new EventEmitter();
		this.typeOptions = ["partly-payment", "rent", "loan"];
		this.currentType = this.typeOptions[0];
	}

	ngOnInit() {
		this.selectType("partly-payment");
	}

	public selectType(selectedType: SelectableType) {
		this.selectedType.emit(selectedType);
	}
}
