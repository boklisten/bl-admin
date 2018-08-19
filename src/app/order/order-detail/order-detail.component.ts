import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OrderService} from '@wizardcoder/bl-connect';
import {BlApiError, Order} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-order-detail',
	templateUrl: './order-detail.component.html',
	styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
	private _currentId: string;
	public warningText: string;
	public wait: boolean;
	public order: Order;

	constructor(private _route: ActivatedRoute, private _orderService: OrderService) {
		this.warningText = null;
		this.wait = false;
	}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this._currentId = params['id'];

			if (this._currentId) {
				this.getOrder(this._currentId);
			}
		});
	}

	private getOrder(id: string) {
		this.warningText = null;
		this.wait = true;
		this._orderService.getById(id).then((order: Order) => {
			this.wait = false;
			this.order = order;
		}).catch((blApiError: BlApiError) => {
			this.warningText = 'could not get order';
			this.wait = false;

		});
	}

}
