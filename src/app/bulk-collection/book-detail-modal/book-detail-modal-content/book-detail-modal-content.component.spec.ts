import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BookDetailModalContentComponent } from "./book-detail-modal-content.component";

describe("BookDetailModalContentComponent", () => {
	let component: BookDetailModalContentComponent;
	let fixture: ComponentFixture<BookDetailModalContentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BookDetailModalContentComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BookDetailModalContentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
