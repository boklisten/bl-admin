import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerOrderItemListItemComponent } from "./customer-order-item-list-item.component";

describe("CustomerOrderItemListItemComponent", () => {
	let component: CustomerOrderItemListItemComponent;
	let fixture: ComponentFixture<CustomerOrderItemListItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CustomerOrderItemListItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerOrderItemListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
