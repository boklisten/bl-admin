import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderItemDetailListItemComponent } from "./order-item-detail-list-item.component";

describe("OrderItemDetailListItemComponent", () => {
	let component: OrderItemDetailListItemComponent;
	let fixture: ComponentFixture<OrderItemDetailListItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderItemDetailListItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderItemDetailListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
