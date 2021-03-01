import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerCurrentComponent } from "./customer-current.component";

describe("CustomerCurrentComponent", () => {
	let component: CustomerCurrentComponent;
	let fixture: ComponentFixture<CustomerCurrentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CustomerCurrentComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerCurrentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
