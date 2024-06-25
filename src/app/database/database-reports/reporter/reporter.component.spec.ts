import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Component } from "@angular/core";

import { ReporterComponent } from "./reporter.component";

@Component({ selector: "app-report-download", template: "" })
class ReportDownloadStubComponent {}

describe("ReporterComponent", () => {
	let component: ReporterComponent;
	let fixture: ComponentFixture<ReporterComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ReporterComponent, ReportDownloadStubComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ReporterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
