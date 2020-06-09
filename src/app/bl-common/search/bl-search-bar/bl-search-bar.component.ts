import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
	selector: "app-bl-search-bar",
	templateUrl: "./bl-search-bar.component.html",
	styleUrls: ["./bl-search-bar.component.scss"]
})
export class BlSearchBarComponent implements OnInit {
	@Input() placeholder: string;
	@Input() wait: boolean;
	@Input() term: string;
	@Input() small: boolean;
	@Input() searchFieldId: string;
	@Input() design: "dark" | "light";

	@Output() search: EventEmitter<string>;
	@Output() focus: EventEmitter<boolean>;

	public searchTerm: string;

	constructor() {
		this.search = new EventEmitter<string>();
		this.focus = new EventEmitter<boolean>();
	}

	ngOnInit() {
		if (this.term) {
			this.searchTerm = this.term;
		} else {
			this.searchTerm = "";
		}
	}

	onSearch() {
		this.search.emit(this.searchTerm);
	}

	public onFocus() {
		this.focus.emit(true);
	}
}
