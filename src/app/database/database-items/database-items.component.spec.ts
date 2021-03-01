import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatabaseItemsComponent } from "./database-items.component";

describe("DatabaseItemsComponent", () => {
	let component: DatabaseItemsComponent;
	let fixture: ComponentFixture<DatabaseItemsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatabaseItemsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatabaseItemsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
