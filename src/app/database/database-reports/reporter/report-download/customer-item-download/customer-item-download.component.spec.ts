import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
	Component,
	Input,
	Output,
	EventEmitter,
	Injectable,
} from "@angular/core";

import { CustomerItemDownloadComponent } from "./customer-item-download.component";

@Component({ selector: "app-bl-common-update-button", template: "" })
class BlCommonUpdateButtonStubComponent {
	@Input() wait;
}

@Component({ selector: "app-bl-common-toggle-button", template: "" })
class BlCommonToggleButtonStubComponent {
	@Input() value;
	@Output() valueChange;

	constructor() {
		this.valueChange = new EventEmitter<any>();
	}
}

@Component({ selector: "fa-icon", template: "" })
class FaIconStub {
	@Input() icon;
}

@Component({ selector: "app-blc-period-select", template: "" })
class BlcPeriodSelectStubComponent {
	@Output() periodChange;

	constructor() {
		this.periodChange = new EventEmitter<any>();
	}
}

@Injectable()
class CustomerItemDownloadStubService {}

describe("CustomerItemDownloadComponent", () => {
	let component: CustomerItemDownloadComponent;
	let fixture: ComponentFixture<CustomerItemDownloadComponent>;
	let customerItemDownloadServiceSpy;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					CustomerItemDownloadComponent,
					BlCommonUpdateButtonStubComponent,
					BlCommonToggleButtonStubComponent,
					BlcPeriodSelectStubComponent,
					FaIconStub,
				],
				providers: [
					{
						provide: CustomerItemDownloadService,
						useClass: CustomerItemDownloadStubService,
					},
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerItemDownloadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
