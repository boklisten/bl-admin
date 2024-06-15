import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerMatchesComponent } from "./customer-matches.component";

describe("CustomerMatchesComponent", () => {
	let component: CustomerMatchesComponent;
	let fixture: ComponentFixture<CustomerMatchesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CustomerMatchesComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomerMatchesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
