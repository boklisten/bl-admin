import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatabaseCompanyListComponent } from "./database-company-list.component";

describe("DatabaseCompanyListComponent", () => {
	let component: DatabaseCompanyListComponent;
	let fixture: ComponentFixture<DatabaseCompanyListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatabaseCompanyListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatabaseCompanyListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
