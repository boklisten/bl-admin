import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UniqueItemScanToCartComponent } from "./unique-item-scan-to-cart.component";

describe("UniqueItemScanToCartComponent", () => {
	let component: UniqueItemScanToCartComponent;
	let fixture: ComponentFixture<UniqueItemScanToCartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UniqueItemScanToCartComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UniqueItemScanToCartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
