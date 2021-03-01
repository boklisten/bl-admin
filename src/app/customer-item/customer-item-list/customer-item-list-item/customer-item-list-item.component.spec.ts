import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerItemListItemComponent } from "./customer-item-list-item.component";

describe("CustomerItemListItemComponent", () => {
	let component: CustomerItemListItemComponent;
	let fixture: ComponentFixture<CustomerItemListItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CustomerItemListItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerItemListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
