import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserOrderSummaryComponent } from "./user-order-summary.component";

describe("UserOrderSummaryComponent", () => {
	let component: UserOrderSummaryComponent;
	let fixture: ComponentFixture<UserOrderSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UserOrderSummaryComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserOrderSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
