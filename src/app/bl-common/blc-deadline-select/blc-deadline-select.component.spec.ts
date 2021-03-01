import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlcDeadlineSelectComponent } from "./blc-deadline-select.component";

describe("BlcDeadlineSelectComponent", () => {
	let component: BlcDeadlineSelectComponent;
	let fixture: ComponentFixture<BlcDeadlineSelectComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlcDeadlineSelectComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlcDeadlineSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
