import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlidScannerListItemComponent } from "./blid-scanner-list-item.component";

describe("BlidScannerListItemComponent", () => {
	let component: BlidScannerListItemComponent;
	let fixture: ComponentFixture<BlidScannerListItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlidScannerListItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlidScannerListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
