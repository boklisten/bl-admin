import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerSearchResultComponent } from "./customer-search-result.component";

describe("CustomerSearchResultComponent", () => {
	let component: CustomerSearchResultComponent;
	let fixture: ComponentFixture<CustomerSearchResultComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CustomerSearchResultComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerSearchResultComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
