import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderDeliveryDetailComponent } from "./order-delivery-detail.component";

describe("OrderDeliveryDetailComponent", () => {
	let component: OrderDeliveryDetailComponent;
	let fixture: ComponentFixture<OrderDeliveryDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderDeliveryDetailComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderDeliveryDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
