import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BranchEditListComponent } from "./branch-edit-list.component";

describe("BranchEditListComponent", () => {
	let component: BranchEditListComponent;
	let fixture: ComponentFixture<BranchEditListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BranchEditListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BranchEditListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
