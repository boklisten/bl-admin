import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerDetailPopoverComponent } from "./customer-detail-popover.component";

describe("CustomerDetailPopoverComponent", () => {
	let component: CustomerDetailPopoverComponent;
	let fixture: ComponentFixture<CustomerDetailPopoverComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CustomerDetailPopoverComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerDetailPopoverComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
