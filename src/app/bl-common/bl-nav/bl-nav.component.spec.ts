import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlNavComponent } from "./bl-nav.component";

describe("BlNavComponent", () => {
	let component: BlNavComponent;
	let fixture: ComponentFixture<BlNavComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BlNavComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BlNavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
