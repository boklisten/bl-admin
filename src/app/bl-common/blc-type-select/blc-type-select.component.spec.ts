import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlcTypeSelectComponent } from "./blc-type-select.component";

describe("BlcTypeSelectComponent", () => {
	let component: BlcTypeSelectComponent;
	let fixture: ComponentFixture<BlcTypeSelectComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlcTypeSelectComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlcTypeSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
