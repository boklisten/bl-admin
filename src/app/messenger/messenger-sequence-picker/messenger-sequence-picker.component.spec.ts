import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MessengerSequencePickerComponent } from "./messenger-sequence-picker.component";

describe("MessengerSequencePickerComponent", () => {
	let component: MessengerSequencePickerComponent;
	let fixture: ComponentFixture<MessengerSequencePickerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MessengerSequencePickerComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MessengerSequencePickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
