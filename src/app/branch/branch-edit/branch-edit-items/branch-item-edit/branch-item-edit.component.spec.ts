import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BranchItemEditComponent } from "./branch-item-edit.component";

describe("BranchItemEditComponent", () => {
	let component: BranchItemEditComponent;
	let fixture: ComponentFixture<BranchItemEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BranchItemEditComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BranchItemEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
