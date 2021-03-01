import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderManagerListItemComponent } from "./order-manager-list-item.component";

describe("OrderManagerListItemComponent", () => {
	let component: OrderManagerListItemComponent;
	let fixture: ComponentFixture<OrderManagerListItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderManagerListItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderManagerListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
