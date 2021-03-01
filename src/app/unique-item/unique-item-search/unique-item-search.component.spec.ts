import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UniqueItemSearchComponent } from "./unique-item-search.component";

describe("UniqueItemSearchComponent", () => {
	let component: UniqueItemSearchComponent;
	let fixture: ComponentFixture<UniqueItemSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UniqueItemSearchComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UniqueItemSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
