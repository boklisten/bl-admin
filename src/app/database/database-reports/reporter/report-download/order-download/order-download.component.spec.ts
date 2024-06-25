import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {
	Injectable,
	Input,
	Component,
	Output,
	EventEmitter,
} from "@angular/core";
import { OrderDownloadComponent } from "./order-download.component";
import { ExcelService } from "../../excel/excel.service";
import { OrderDownloadService } from "./order-download.service";

@Injectable()
class OrderDownloadStubService {}

@Injectable()
class ExcelStubService {}

@Component({ selector: "app-bl-common-update-button", template: "" })
class BlCommonUpdateButtonStubComponent {
	@Input() wait: any;
}

@Component({ selector: "fa-icon", template: "" })
class FaIconStub {
	@Input() icon: any;
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
	@Output() periodChange: EventEmitter<any>;

	constructor() {
		this.periodChange = new EventEmitter<any>();
	}
}

describe("OrderDownloadComponent", () => {
	let component: OrderDownloadComponent;
	let fixture: ComponentFixture<OrderDownloadComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					OrderDownloadComponent,
					BlCommonUpdateButtonStubComponent,
					FaIconStub,
					BlCommonToggleButtonStubComponent,
					BlcPeriodSelectStubComponent,
				],
				providers: [
					{ provide: ExcelService, useClass: ExcelStubService },
					{
						provide: OrderDownloadService,
						useClass: OrderDownloadStubService,
					},
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderDownloadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
