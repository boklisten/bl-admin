import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Input, Component, Output, EventEmitter } from "@angular/core";

import { PaymentDownloadComponent } from "./payment-download.component";
import { PaymentDownloadService } from "./payment-download.service";

import { BlCommonToggleButtonComponent } from "../../../bl-common/buttons/bl-common-toggle-button/bl-common-toggle-button.component";
import { BlcPeriodSelectComponent } from "../../../bl-common/blc-period/blc-period-select/blc-period-select.component";
import { BlCommonUpdateButtonComponent } from "../../../bl-common/buttons/bl-common-update-button/bl-common-update-button.component";
import { ExcelService } from "../../excel/excel.service";

@Component({ selector: "fa-icon", template: "" })
class FaIconStub {
	@Input() icon;
}

@Component({ selector: "app-bl-common-update-button", template: "" })
class BlCommonUpdateButtonStubComponent {
	@Input() value;
	@Output() valueChange;
	@Input() wait;

	constructor() {
		this.valueChange = new EventEmitter<any>();
	}
}

@Component({ selector: "app-bl-common-toggle-button", template: "" })
class BlCommonToggleButtonStubComponent {
	@Input() value;
	@Output() valueChange;

	constructor() {
		this.valueChange = new EventEmitter<any>();
	}
}

@Component({ selector: "app-blc-period-select", template: "" })
class BlcPeriodSelectStubComponent {
	@Input() period;
	@Output() periodChange;

	constructor() {
		this.periodChange = new EventEmitter<any>();
	}
}

describe("PaymentDownloadComponent", () => {
	let component: PaymentDownloadComponent;
	let fixture: ComponentFixture<PaymentDownloadComponent>;

	beforeEach(
		waitForAsync(() => {
			const getPaymentsByFilterSpy = jasmine.createSpyObj(
				"PaymentDownloadService",
				["getPaymentsByFilter"]
			);
			const objectsToExcelFileSpy = jasmine.createSpyObj("ExcelService", [
				"objectsToExcelFile",
			]);

			TestBed.configureTestingModule({
				declarations: [
					PaymentDownloadComponent,
					BlCommonToggleButtonStubComponent,
					BlcPeriodSelectStubComponent,
					BlCommonUpdateButtonStubComponent,
					FaIconStub,
				],
				providers: [
					{
						provide: PaymentDownloadService,
						useValue: getPaymentsByFilterSpy,
					},
					{ provide: ExcelService, useValue: objectsToExcelFileSpy },
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PaymentDownloadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it('should have title "Payments"', () => {
		const title = fixture.nativeElement.querySelector("h6");
		expect(title.textContent).toEqual("Payments");
	});
});
