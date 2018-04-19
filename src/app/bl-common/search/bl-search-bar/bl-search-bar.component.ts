import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-bl-search-bar',
	templateUrl: './bl-search-bar.component.html',
	styleUrls: ['./bl-search-bar.component.scss']
})
export class BlSearchBarComponent implements OnInit {
	@Input() placeholder: string;
	@Input() wait: boolean;
	@Input() term: string;
	@Output() search: EventEmitter<string>;

	public searchTerm: string;

	constructor() {
		this.search = new EventEmitter<string>();
	}

	ngOnInit() {
		if (this.term) {
			this.searchTerm = this.term;
		} else {
			this.searchTerm = '';
		}
	}

	onSearch() {
		this.search.emit(this.searchTerm);
	}

}
