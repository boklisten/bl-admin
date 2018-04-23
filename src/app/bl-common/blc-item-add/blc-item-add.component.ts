import {Component, Input, OnInit} from '@angular/core';
import {CustomerItem, Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {CartService} from '../../cart/cart.service';

@Component({
	selector: 'app-blc-item-add',
	templateUrl: './blc-item-add.component.html',
	styleUrls: ['./blc-item-add.component.scss']
})
export class BlcItemAddComponent implements OnInit {
	@Input() item: Item;
	@Input() orderItem: OrderItem;
	@Input() order: Order;
	@Input() customerItem: CustomerItem;

	public added: boolean;

	constructor(private _cartService: CartService) {
		this.added = false;
	}

	ngOnInit() {
		this.checkIfAdded();

		this._cartService.onCartChange().subscribe(() => {
			this.checkIfAdded();
		});
	}

	private checkIfAdded() {
		this.added = this._cartService.contains((this.orderItem) ? this.orderItem.item : this.item.id);
	}

	public onClick() {
		if (this.order && this.orderItem) {
			this.handleOrderItem();
		} else if (this.customerItem) {
			this.handleCustomerItem();
		} else {
			this.handleItem();
		}
	}


	private handleCustomerItem() {
		if (this._cartService.contains(this.customerItem.item)) {
			this._cartService.remove(this.customerItem.item);
			this.added = false;
		} else {
			this._cartService.addCustomerItem(this.customerItem);
			this.added = true;
		}
	}


	private handleOrderItem() {
		if (this._cartService.contains(this.orderItem.item)) {
			this._cartService.remove(this.orderItem.item);
			this.added = false;
		} else {
			this._cartService.addOrderItem(this.orderItem, this.order);
			this.added = true;
		}
	}

	private handleItem() {
		if (this._cartService.contains(this.item.id)) {
			this._cartService.remove(this.item.id);
			this.added = false;
		} else {
			this._cartService.add(this.item);
			this.added = true;
		}
	}
}
