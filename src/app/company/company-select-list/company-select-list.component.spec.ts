import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompanySelectListComponent } from "./company-select-list.component";

describe("CompanySelectListComponent", () => {
	let component: CompanySelectListComponent;
	let fixture: ComponentFixture<CompanySelectListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CompanySelectListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CompanySelectListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
