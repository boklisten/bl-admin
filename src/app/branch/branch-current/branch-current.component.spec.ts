import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BranchCurrentComponent } from "./branch-current.component";

describe("BranchCurrentComponent", () => {
	let component: BranchCurrentComponent;
	let fixture: ComponentFixture<BranchCurrentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BranchCurrentComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BranchCurrentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
