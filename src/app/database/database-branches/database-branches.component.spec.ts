import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatabaseBranchesComponent } from "./database-branches.component";

describe("DatabaseBranchesComponent", () => {
	let component: DatabaseBranchesComponent;
	let fixture: ComponentFixture<DatabaseBranchesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatabaseBranchesComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatabaseBranchesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
