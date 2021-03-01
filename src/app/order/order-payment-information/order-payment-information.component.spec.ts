import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderPaymentInformationComponent } from "./order-payment-information.component";

describe("OrderPaymentInformationComponent", () => {
	let component: OrderPaymentInformationComponent;
	let fixture: ComponentFixture<OrderPaymentInformationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderPaymentInformationComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderPaymentInformationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
