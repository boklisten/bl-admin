import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerItemListComponent } from "./customer-item-list.component";

describe("CustomerItemListComponent", () => {
	let component: CustomerItemListComponent;
	let fixture: ComponentFixture<CustomerItemListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CustomerItemListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerItemListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
