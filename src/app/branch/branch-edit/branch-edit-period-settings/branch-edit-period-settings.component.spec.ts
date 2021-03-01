import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BranchEditPeriodSettingsComponent } from "./branch-edit-period-settings.component";

describe("BranchEditPriceInfoComponent", () => {
	let component: BranchEditPeriodSettingsComponent;
	let fixture: ComponentFixture<BranchEditPeriodSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BranchEditPeriodSettingsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BranchEditPeriodSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
