import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlcPeriodSelectComponent } from "./blc-period-select.component";

describe("BlcPeriodSelectComponent", () => {
	let component: BlcPeriodSelectComponent;
	let fixture: ComponentFixture<BlcPeriodSelectComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlcPeriodSelectComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlcPeriodSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
