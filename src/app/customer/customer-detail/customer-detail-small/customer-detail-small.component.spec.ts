import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerDetailSmallComponent } from "./customer-detail-small.component";

describe("CustomerDetailSmallComponent", () => {
	let component: CustomerDetailSmallComponent;
	let fixture: ComponentFixture<CustomerDetailSmallComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CustomerDetailSmallComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerDetailSmallComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
