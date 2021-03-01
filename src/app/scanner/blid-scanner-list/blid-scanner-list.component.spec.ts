import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlidScannerListComponent } from "./blid-scanner-list.component";

describe("UidScannerListComponent", () => {
	let component: BlidScannerListComponent;
	let fixture: ComponentFixture<BlidScannerListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlidScannerListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlidScannerListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
