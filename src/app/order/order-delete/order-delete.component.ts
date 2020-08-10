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
import { UserService } from "../../user/user.service";

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
	public isAdmin: boolean;

	constructor(
		private _modalService: NgbModal,
		private _orderService: OrderService,
		private _userService: UserService
	) {
		this.deleted = new EventEmitter();
	}

	ngOnInit() {
		this.userIdOrderInput = "";
		this.isAdmin = this._userService.havePermission("admin");
	}

	public onShowDeleteModal() {
		this._modalService.open(this.deleteOrderModalContent, {
			beforeDismiss: () => {
				this.userIdOrderInput = "";
				return true;
			}
		});
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
