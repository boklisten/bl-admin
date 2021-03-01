import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UniqueItemDetailComponent } from "./unique-item-detail.component";

describe("UniqueItemDetailComponent", () => {
	let component: UniqueItemDetailComponent;
	let fixture: ComponentFixture<UniqueItemDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UniqueItemDetailComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UniqueItemDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
