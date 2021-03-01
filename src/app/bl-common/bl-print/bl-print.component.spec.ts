import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlPrintComponent } from "./bl-print.component";

describe("BlPrintComponent", () => {
	let component: BlPrintComponent;
	let fixture: ComponentFixture<BlPrintComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlPrintComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlPrintComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
