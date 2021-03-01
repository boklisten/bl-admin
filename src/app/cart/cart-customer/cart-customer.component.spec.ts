import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CartCustomerComponent } from "./cart-customer.component";

describe("CartCustomerComponent", () => {
	let component: CartCustomerComponent;
	let fixture: ComponentFixture<CartCustomerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CartCustomerComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CartCustomerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
