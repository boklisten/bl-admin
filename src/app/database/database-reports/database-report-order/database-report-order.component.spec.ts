import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatabaseReportOrderComponent } from "./database-report-order.component";

describe("DatabaseReportOrderComponent", () => {
	let component: DatabaseReportOrderComponent;
	let fixture: ComponentFixture<DatabaseReportOrderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatabaseReportOrderComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatabaseReportOrderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
