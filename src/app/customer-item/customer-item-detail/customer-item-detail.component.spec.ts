import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerItemDetailComponent } from "./customer-item-detail.component";

describe("CustomerItemDetailComponent", () => {
	let component: CustomerItemDetailComponent;
	let fixture: ComponentFixture<CustomerItemDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CustomerItemDetailComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerItemDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
