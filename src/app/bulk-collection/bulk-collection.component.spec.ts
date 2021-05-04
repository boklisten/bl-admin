import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BulkCollectionComponent } from "./bulk-collection.component";

describe("BulkCollectionComponent", () => {
	let component: BulkCollectionComponent;
	let fixture: ComponentFixture<BulkCollectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BulkCollectionComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BulkCollectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
