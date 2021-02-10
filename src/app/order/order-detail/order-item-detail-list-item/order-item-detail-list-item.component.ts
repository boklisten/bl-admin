import {
	Component,
	OnInit,
	Input,
	ViewChild,
	Output,
	EventEmitter
} from "@angular/core";
import { OrderItem } from "@boklisten/bl-model";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-order-item-detail-list-item",
	templateUrl: "./order-item-detail-list-item.component.html",
	styleUrls: ["./order-item-detail-list-item.component.scss"]
})
export class OrderItemDetailListItemComponent implements OnInit {
	@Input() orderItem: OrderItem;
	@Input() index: number;
	@ViewChild("orderItemEditModal") private orderItemEditModal: NgbModalRef;
	@Output() shouldDelete: EventEmitter<boolean>;

	constructor(private _modalService: NgbModal) {
		this.shouldDelete = new EventEmitter();
	}

	ngOnInit() {}

	public onClick() {
		this._modalService.open(this.orderItemEditModal);
	}

	public onShouldDelete() {
		this._modalService.dismissAll();
		this.shouldDelete.emit(true);
	}
}
