import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ReportDownloadComponent } from "./report-download.component";
import { Component } from "@angular/core";

@Component({ selector: "app-order-download", template: "" })
class OrderDownloadStubComponent {}

@Component({ selector: "app-payment-download", template: "" })
class PaymentDownloadStubComponent {}

@Component({ selector: "app-customer-item-download", template: "" })
class CustomerItemDownloadStubComponent {}

describe("ReportDownloadComponent", () => {
	let component: ReportDownloadComponent;
	let fixture: ComponentFixture<ReportDownloadComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					ReportDownloadComponent,
					OrderDownloadStubComponent,
					PaymentDownloadStubComponent,
					CustomerItemDownloadStubComponent,
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportDownloadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
