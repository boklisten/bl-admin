import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BookingListEditComponent } from "./booking-list-edit.component";

describe("BookingListEditComponent", () => {
	let component: BookingListEditComponent;
	let fixture: ComponentFixture<BookingListEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BookingListEditComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BookingListEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
