import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatabaseCompaniesComponent } from "./database-companies.component";

describe("DatabaseCompaniesComponent", () => {
	let component: DatabaseCompaniesComponent;
	let fixture: ComponentFixture<DatabaseCompaniesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatabaseCompaniesComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatabaseCompaniesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
