import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlcButtonCheckComponent } from "./blc-button-check.component";

describe("BlcButtonCheckComponent", () => {
	let component: BlcButtonCheckComponent;
	let fixture: ComponentFixture<BlcButtonCheckComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlcButtonCheckComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlcButtonCheckComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
