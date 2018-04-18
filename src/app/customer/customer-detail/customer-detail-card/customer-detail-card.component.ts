import {Component, Input, OnInit} from '@angular/core';
import {UserDetail} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-customer-detail-card',
	templateUrl: './customer-detail-card.component.html',
	styleUrls: ['./customer-detail-card.component.scss']
})
export class CustomerDetailCardComponent implements OnInit {
	@Input() customerDetail: UserDetail;

	constructor() {
	}

	ngOnInit() {
	}

}