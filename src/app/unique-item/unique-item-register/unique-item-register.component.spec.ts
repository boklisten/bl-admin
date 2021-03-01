import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UniqueItemRegisterComponent } from "./unique-item-register.component";

describe("UniqueItemRegisterComponent", () => {
	let component: UniqueItemRegisterComponent;
	let fixture: ComponentFixture<UniqueItemRegisterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UniqueItemRegisterComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UniqueItemRegisterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
