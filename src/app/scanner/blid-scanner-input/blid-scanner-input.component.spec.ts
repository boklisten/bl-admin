import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlidScannerInputComponent } from "./blid-scanner-input.component";

describe("BlidScannerInputComponent", () => {
	let component: BlidScannerInputComponent;
	let fixture: ComponentFixture<BlidScannerInputComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlidScannerInputComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlidScannerInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
