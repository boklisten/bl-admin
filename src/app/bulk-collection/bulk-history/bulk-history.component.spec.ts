import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BulkHistoryComponent } from "./bulk-history.component";

describe("BulkHistoryComponent", () => {
	let component: BulkHistoryComponent;
	let fixture: ComponentFixture<BulkHistoryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BulkHistoryComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BulkHistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
