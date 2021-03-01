import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BranchUploadComponent } from "./branch-upload.component";

describe("BranchUploadComponent", () => {
	let component: BranchUploadComponent;
	let fixture: ComponentFixture<BranchUploadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BranchUploadComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BranchUploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
