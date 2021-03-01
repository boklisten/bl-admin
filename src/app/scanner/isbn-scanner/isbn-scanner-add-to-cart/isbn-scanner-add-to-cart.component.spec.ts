import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { IsbnScannerAddToCartComponent } from "./isbn-scanner-add-to-cart.component";

describe("IsbnScannerAddToCartComponent", () => {
	let component: IsbnScannerAddToCartComponent;
	let fixture: ComponentFixture<IsbnScannerAddToCartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [IsbnScannerAddToCartComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IsbnScannerAddToCartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
