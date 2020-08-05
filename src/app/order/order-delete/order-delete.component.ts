import {
	Component,
	OnInit,
	Input,
	ViewChild,
	Output,
	EventEmitter
} from "@angular/core";
import { Order } from "@wizardcoder/bl-model";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { OrderService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-order-delete",
	templateUrl: "./order-delete.component.html",
	styleUrls: ["./order-delete.component.scss"]
})
export class OrderDeleteComponent implements OnInit {
	@Input() order: Order;
	@ViewChild("deleteOrderModal") private deleteOrderModalContent: NgbModalRef;
	@Output() deleted: EventEmitter<boolean>;

	public userIdOrderInput: string;
	public orderIdConfirmed: boolean;
	public wait: boolean;
	public showDeleteError: boolean;

	constructor(
		private _modalService: NgbModal,
		private _orderService: OrderService
	) {
		this.deleted = new EventEmitter();
	}

	ngOnInit() {
		this.userIdOrderInput = "";
	}

	public onShowDeleteModal() {
		this._modalService.open(this.deleteOrderModalContent);
	}

	public onDelete() {
		this.wait = true;
		this.showDeleteError = false;
		this._orderService
			.remove(this.order.id)
			.then(() => {
				this.wait = false;
				this.deleted.emit(true);
				this.userIdOrderInput = "";
				this._modalService.dismissAll();
			})
			.catch(err => {
				this.showDeleteError = true;
				this.userIdOrderInput = "";
				this.onOrderIdInputChange(this.userIdOrderInput);
				this.wait = false;
			});
	}

	public onOrderIdInputChange(orderId: string) {
		this.orderIdConfirmed = orderId === this.order.id.toString();
	}
}
