import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DeliveryTrackingNumberEditComponent } from "./delivery-tracking-number-edit.component";

describe("DeliveryTrackingNumberEditComponent", () => {
	let component: DeliveryTrackingNumberEditComponent;
	let fixture: ComponentFixture<DeliveryTrackingNumberEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeliveryTrackingNumberEditComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeliveryTrackingNumberEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
